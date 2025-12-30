'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Button, GhostButton } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { getSites } from '@/data/repositories/siteRepository';
import { getTasksForDate, markTaskComplete } from '@/data/repositories/taskRepository';
import { isFirebaseConfigured } from '@/lib/firebase';
import { sampleSites, sampleTasks } from '@/lib/sampleData';
import type { Site, Task } from '@/lib/types';

declare global {
  interface Window {
    google: any;
  }
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = { lat: 39.5, lng: -98.35 };

const todayKey = new Date().toISOString().split('T')[0];

export default function MapPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const mapRef = useRef<any>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  useEffect(() => {
    async function hydrate() {
      setLoadingData(true);
      setError(null);
      try {
        if (isFirebaseConfigured) {
          const [siteData, taskData] = await Promise.all([getSites(), getTasksForDate(todayKey)]);
          setSites(siteData);
          setTasks(taskData);
          setUsingSampleData(false);
          return;
        }

        setSites(sampleSites);
        setTasks(sampleTasks.filter((task) => task.dueDate === todayKey));
        setUsingSampleData(true);
      } catch (err) {
        console.error('Unable to load live data. Falling back to sample data.', err);
        setSites(sampleSites);
        setTasks(sampleTasks.filter((task) => task.dueDate === todayKey));
        setUsingSampleData(true);
        setError('Unable to load live data. Showing sample data instead.');
      } finally {
        setLoadingData(false);
      }
    }

    void hydrate();
  }, []);

  const tasksBySite = useMemo(() => {
    return tasks.reduce<Map<string, Task[]>>((map, task) => {
      const existing = map.get(task.siteId) ?? [];
      map.set(task.siteId, [...existing, task]);
      return map;
    }, new Map());
  }, [tasks]);

  const todaySites = useMemo(() => sites.filter((site) => (tasksBySite.get(site.id)?.length ?? 0) > 0), [sites, tasksBySite]);
  const selectedSite = useMemo(() => sites.find((site) => site.id === selectedSiteId) ?? null, [selectedSiteId, sites]);

  const center = useMemo(() => selectedSite?.coordinates ?? todaySites[0]?.coordinates ?? sites[0]?.coordinates ?? defaultCenter, [selectedSite, sites, todaySites]);

  const focusOnRoute = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const targets = (todaySites.length ? todaySites : sites).filter((site) => !!site.coordinates);
    if (!targets.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    targets.forEach((site) => bounds.extend(site.coordinates));
    mapRef.current.fitBounds(bounds, 64);
  }, [sites, todaySites]);

  useEffect(() => {
    if (isLoaded && !loadingData && sites.length) {
      focusOnRoute();
    }
  }, [focusOnRoute, isLoaded, loadingData, sites.length]);

  const handleCompleteTask = useCallback(
    async (taskId: string) => {
      setCompletingTaskId(taskId);
      try {
        if (isFirebaseConfigured) {
          await markTaskComplete(taskId);
        }
        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: 'done' } : task)));
      } catch (err) {
        console.error('Failed to mark task complete', err);
        setError('Unable to update the task right now. Please try again.');
      } finally {
        setCompletingTaskId(null);
      }
    },
    []
  );

  const renderMapContent = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return (
        <div className="flex h-[600px] items-center justify-center bg-gray-50 text-sm text-gray-600">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the interactive map.
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="flex h-[600px] items-center justify-center bg-rose-50 text-sm text-rose-700">
          Failed to load Google Maps. Check network or API key configuration.
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div className="flex h-[600px] items-center justify-center bg-gray-50 text-sm text-gray-600">
          Loading map...
        </div>
      );
    }

    return (
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={6}
          options={{ disableDefaultUI: true, zoomControl: true }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
        >
          {sites.map((site) => (
            <Marker key={site.id} position={site.coordinates} onClick={() => setSelectedSiteId(site.id)} label={site.name} />
          ))}

          {selectedSite && (
            <InfoWindow key={selectedSite.id} position={selectedSite.coordinates} onCloseClick={() => setSelectedSiteId(null)}>
              <div className="w-72 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-gray-500">Site</p>
                  <h3 className="text-base font-semibold text-gray-900">{selectedSite.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedSite.address}, {selectedSite.city}
                  </p>
                  <p className="text-sm text-gray-600">Manager: {selectedSite.manager}</p>
                  <p className="text-xs text-gray-500">Next visit: {selectedSite.nextVisit}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-gray-500">Today&apos;s tasks</p>
                  {(tasksBySite.get(selectedSite.id) ?? []).length === 0 ? (
                    <p className="text-sm text-gray-600">No tasks scheduled for today.</p>
                  ) : (
                    <ul className="space-y-2">
                      {(tasksBySite.get(selectedSite.id) ?? []).map((task) => (
                        <li key={task.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                              <p className="text-xs text-gray-600">
                                {task.priority} priority • Assigned to {task.assignee}
                              </p>
                            </div>
                            {task.status === 'done' ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Done</span>
                            ) : (
                              <Button
                                className="px-3 py-1 text-xs"
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={completingTaskId === task.id}
                              >
                                {completingTaskId === task.id ? 'Updating...' : 'Mark complete'}
                              </Button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {loadingData && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-gray-700">
            Loading sites and tasks...
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-brand-700">Route planning</p>
        <h1 className="text-3xl font-semibold text-gray-900">Map & stops</h1>
        <p className="text-sm text-gray-600">Visualize today&apos;s scheduled sites, tasks, and completion progress.</p>
      </header>

      <Card>
        <CardHeader
          title="Field map"
          subtitle={usingSampleData ? 'Showing sample data' : 'Live Firestore data'}
          action={
            <div className="flex items-center gap-2">
              <GhostButton onClick={focusOnRoute} disabled={!isLoaded || loadingData || !sites.length}>
                Focus on my route
              </GhostButton>
              <Button
                onClick={() => {
                  setSelectedSiteId(null);
                  focusOnRoute();
                }}
                disabled={!isLoaded || loadingData || !sites.length}
              >
                Fit to pins
              </Button>
            </div>
          }
        />

        {error && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}

        <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">{renderMapContent()}</div>
      </Card>
    </main>
  );
}
