'use client';

import { useEffect, useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Menu,
    CloudCog,
    BookOpen,
    PencilLine,
    ClipboardCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

// Import all 12 module components
import Module1Page from '../components/module1/page';
import Module2Page from '../components/module2/page';
import Module3Page from '../components/module3/page';
import Module4Page from '../components/module4/page';
import Module5Page from '../components/module5/page';
import Module6Page from '../components/module6/page';
import Module7Page from '../components/module7/page';
import Module8Page from '../components/module8/page';
import Module9Page from '../components/module9/page';
import Module10Page from '../components/module10/page';
import Module11Page from '../components/module11/page';
import Module12Page from '../components/module12/page';

type ViewType = 'notes' | 'practice' | 'quiz';

interface ModuleMeta {
    id: number;
    title: string;
    ready: boolean;
}

const COURSE_ID = 'cloud-computing';

const modules: ModuleMeta[] = [
    { id: 1, title: 'Computing Paradigms & Cloud Fundamentals', ready: true },
    { id: 2, title: 'Cloud Models, Virtualization, XML & Web Services', ready: true },
    { id: 3, title: 'Cloud Architecture & Service Models', ready: true },
    { id: 4, title: 'Cloud Storage & Database Services', ready: true },
    { id: 5, title: 'Virtualization Technologies', ready: true },
    { id: 6, title: 'Cloud Security & Compliance', ready: true },
    { id: 7, title: 'Cloud Networking & CDN', ready: true },
    { id: 8, title: 'Cloud Monitoring & Logging', ready: true },
    { id: 9, title: 'Serverless Computing', ready: true },
    { id: 10, title: 'Cloud Cost Management', ready: true },
    { id: 11, title: 'DevOps & CI/CD in Cloud', ready: true },
    { id: 12, title: 'Cloud Migration & Case Studies', ready: true },
];

const viewIcons: Record<ViewType, React.ReactNode> = {
    notes: <BookOpen size={15} />,
    practice: <PencilLine size={15} />,
    quiz: <ClipboardCheck size={15} />,
};

const viewLabels: Record<ViewType, string> = {
    notes: 'Notes',
    practice: 'Practice',
    quiz: 'Quiz',
};

function ComingSoon({ moduleTitle }: { moduleTitle: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/40 px-8 py-20 text-center">
            <CloudCog size={36} className="mb-4 text-slate-600" />
            <p className="text-slate-300">
                Content for <span className="font-medium text-slate-100">{moduleTitle}</span> hasn&apos;t been added yet.
            </p>
            <p className="mt-1 text-sm text-slate-500">Content will be added soon.</p>
        </div>
    );
}

// Shown while we're checking auth state and payment status.
function LoadingGate() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
            <div className="flex flex-col items-center gap-3">
                <CloudCog size={32} className="animate-pulse text-indigo-400" />
                <p className="text-sm">Checking access…</p>
            </div>
        </div>
    );
}

// Shown when there's no signed-in user at all.
function SignInRequired() {
    const router = useRouter();
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950 px-6 text-center text-slate-300">
            <div className="max-w-sm">
                <p className="mb-4 text-lg font-medium text-slate-100">Please sign in to continue</p>
                <p className="mb-6 text-sm text-slate-500">
                    You need to be signed in to access this course.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
                >
                    Go back to sign in
                </button>
            </div>
        </div>
    );
}

// Shown when the user is signed in but hasn't paid for this course.
function AccessRequired() {
    const router = useRouter();
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950 px-6 text-center text-slate-300">
            <div className="max-w-sm">
                <p className="mb-4 text-lg font-medium text-slate-100">You haven&apos;t unlocked this course yet</p>
                <p className="mb-6 text-sm text-slate-500">
                    Purchase access to view the modules, practice questions, and quizzes.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:opacity-90"
                >
                    Unlock course
                </button>
            </div>
        </div>
    );
}

// Module renderer — picks the right component based on module id
function ModuleRenderer({ moduleId, view }: { moduleId: number; view: ViewType }) {
    const props = { view };

    switch (moduleId) {
        case 1:
            return <Module1Page {...props} />;
        case 2:
            return <Module2Page {...props} />;
        case 3:
            return <Module3Page {...props} />;
        case 4:
            return <Module4Page {...props} />;
        case 5:
            return <Module5Page {...props} />;
        case 6:
            return <Module6Page {...props} />;
        case 7:
            return <Module7Page {...props} />;
        case 8:
            return <Module8Page {...props} />;
        case 9:
            return <Module9Page {...props} />;
        case 10:
            return <Module10Page {...props} />;
        case 11:
            return <Module11Page {...props} />;
        case 12:
            return <Module12Page {...props} />;
        default:
            return <ComingSoon moduleTitle={`Module ${moduleId}`} />;
    }
}

export default function CloudComputingCoursePage() {
    const { user, loading: authLoading } = useAuth();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [accessChecked, setAccessChecked] = useState(false);

    const [expandedId, setExpandedId] = useState<number | null>(1);
    const [activeModuleId, setActiveModuleId] = useState<number | null>(1);
    const [activeView, setActiveView] = useState<ViewType | null>('notes');
    const [mobileOpen, setMobileOpen] = useState(false);

    // Once we know who's signed in (or that no one is), check whether
    // they've actually paid for this course before rendering any content.
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setHasAccess(false);
            setAccessChecked(true);
            return;
        }

        api
            .checkAccess(COURSE_ID)
            .then((res) => setHasAccess(res.has_access))
            .catch(() => setHasAccess(false))
            .finally(() => setAccessChecked(true));
    }, [authLoading, user]);

    const handleSelect = (moduleId: number, view: ViewType) => {
        setActiveModuleId(moduleId);
        setActiveView(view);
        setMobileOpen(false);
    };

    const activeModule = modules.find((m) => m.id === activeModuleId) || null;

    if (authLoading || !accessChecked) {
        return <LoadingGate />;
    }

    if (!user) {
        return <SignInRequired />;
    }

    if (!hasAccess) {
        return <AccessRequired />;
    }

    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100">
            {/* Mobile top bar */}
            <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-slate-300"
                >
                    <Menu size={22} />
                </button>
                <span className="text-sm font-semibold">Cloud Computing</span>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-20 w-72 flex-shrink-0 border-r border-slate-800 bg-slate-900 transition-transform md:static md:translate-x-0 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <nav className="flex h-full flex-col overflow-y-auto px-3 py-5">
                    <div className="mb-6 flex items-center gap-2 px-2">
                        <CloudCog size={22} className="text-indigo-400" />
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-slate-100">
                                Cloud Computing
                            </p>
                            <p className="text-xs text-slate-500">12-module course</p>
                        </div>
                    </div>

                    <div className="relative space-y-1">
                        <div className="absolute bottom-4 left-[19px] top-4 w-px bg-slate-700" />

                        {modules.map((mod) => {
                            const isExpanded = expandedId === mod.id;
                            return (
                                <div key={mod.id} className="relative">
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                                        className={`relative z-10 flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition ${
                                            isExpanded
                                                ? 'bg-slate-800'
                                                : 'hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <span
                                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-mono ${
                                                mod.ready
                                                    ? 'border-amber-400 bg-slate-900 text-amber-300'
                                                    : 'border-slate-600 bg-slate-900 text-slate-500'
                                            }`}
                                        >
                                            {String(mod.id).padStart(2, '0')}
                                        </span>
                                        <span
                                            className={`flex-1 truncate text-sm ${
                                                mod.ready ? 'text-slate-100' : 'text-slate-500'
                                            }`}
                                        >
                                            {mod.title}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronDown size={15} className="flex-shrink-0 text-slate-400" />
                                        ) : (
                                            <ChevronRight size={15} className="flex-shrink-0 text-slate-500" />
                                        )}
                                    </button>

                                    {isExpanded && mod.ready && (
                                        <div className="ml-9 mb-1 mt-1 space-y-0.5 border-l border-slate-700 pl-3">
                                            {(['notes', 'practice', 'quiz'] as ViewType[]).map((view) => {
                                                const isActive =
                                                    activeModuleId === mod.id && activeView === view;
                                                return (
                                                    <button
                                                        key={view}
                                                        onClick={() => handleSelect(mod.id, view)}
                                                        className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition ${
                                                            isActive
                                                                ? 'bg-indigo-500/15 text-indigo-300'
                                                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                                        }`}
                                                    >
                                                        {viewIcons[view]}
                                                        {viewLabels[view]}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </aside>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-10 bg-black/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    {activeModule && activeView ? (
                        activeModule.ready ? (
                            <ModuleRenderer moduleId={activeModule.id} view={activeView} />
                        ) : (
                            <ComingSoon moduleTitle={activeModule.title} />
                        )
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">
                            Select a module from the sidebar to get started.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}