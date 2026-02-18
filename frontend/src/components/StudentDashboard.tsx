import React, { useEffect, useState } from 'react';
import { User, Assignment, ResourceQuery } from '../types';
import { api } from '../services/api';
import { ExternalLink, Calendar, CheckCircle, Clock, BookOpen, AlertCircle, Hash, Copy, Check, Upload, FileText, UploadCloud, ArrowRight, ChevronDown, Folder, Trash2, Loader2 } from 'lucide-react';
import TypingEffect from './TypingEffect';

interface StudentDashboardProps {
    user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [queries, setQueries] = useState<ResourceQuery[]>([]);
    const [refresh, setRefresh] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showRequests, setShowRequests] = useState(true);

    // Submission input state
    const [submissionLinks, setSubmissionLinks] = useState<Record<string, string>>({});
    const [submittingIds, setSubmittingIds] = useState<Set<string>>(new Set());

    // Resource Upload Form State
    const [uploadForm, setUploadForm] = useState({
        subject: '',
        topic: '',
        fileLink: ''
    });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const allAssignments = await api.getAssignments();
            // The API already filters for the logged in user, but being explicit
            setAssignments(allAssignments);

            const allQueries = await api.getResourceQueries();
            setQueries(allQueries);
        };
        fetchData();
    }, [user.id, refresh]);

    const handleLinkChange = (id: string, value: string) => {
        setSubmissionLinks(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (assignment: Assignment) => {
        const link = submissionLinks[assignment.id];
        if (!link || !link.trim()) {
            alert("Please paste your assignment link (Google Drive file) before submitting.");
            return;
        }

        setSubmittingIds(prev => new Set(prev).add(assignment.id));

        try {
            // Update status
            await api.updateAssignment({
                ...assignment,
                status: 'submitted',
                submittedDate: new Date().toISOString().split('T')[0],
                studentWorkLink: link
            });

            // Cleanup
            const newLinks = { ...submissionLinks };
            delete newLinks[assignment.id];
            setSubmissionLinks(newLinks);

            // Refresh
            setRefresh(prev => prev + 1);
        } catch (error) {
            alert("Submission failed. Please try again.");
        } finally {
            setSubmittingIds(prev => {
                const next = new Set(prev);
                next.delete(assignment.id);
                return next;
            });
        }
    };

    const handleResourceUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user.teacherIds || user.teacherIds.length === 0) return;

        if (!uploadForm.fileLink) {
            alert("Please paste the link of your uploaded file.");
            return;
        }

        setIsUploading(true);
        try {
            await api.addResourceQuery({
                subject: uploadForm.subject,
                topic: uploadForm.topic,
                fileLink: uploadForm.fileLink,
                status: 'pending'
            });

            setUploadForm({ subject: '', topic: '', fileLink: '' });
            setRefresh(prev => prev + 1);
        } catch (error) {
            alert("Failed to submit query.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteQuery = async (id: string) => {
        if (window.confirm("Remove this request from your history?")) {
            await api.deleteResourceQuery(id);
            setRefresh(prev => prev + 1);
        }
    };

    const openUploadFolder = () => {
        if (user.resourceUploadLink) {
            window.open(user.resourceUploadLink, '_blank');
        } else {
            alert("Your teacher hasn't set a resource upload folder yet.");
        }
    };

    const copyId = () => {
        if (user.uniqueId) {
            navigator.clipboard.writeText(user.uniqueId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const activeAssignments = assignments.filter(a => a.status === 'pending');
    const pastAssignments = assignments.filter(a => a.status === 'submitted');

    return (
        <div className="space-y-8 pb-20">
            {/* Header & Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col justify-between">
                    <div className="space-y-2 mb-6">
                        <h2 className="text-3xl font-bold text-white">Hello, {user.name}</h2>
                        <div className="flex flex-col gap-1">
                            <p className="text-neutral-400">Here's what you need to work on today.</p>
                            <div className="text-sm font-semibold">
                                <TypingEffect words={["Architectured by Priyansh", "Empowering Education", "Streamlining Success"]} />
                            </div>
                        </div>
                    </div>

                    {/* Unique ID Card */}
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl inline-flex items-center gap-4 w-full sm:w-fit group hover:border-brand-500/30 transition-colors">
                        <div className="bg-brand-500/10 p-3 rounded-xl group-hover:bg-brand-500/20 transition-colors">
                            <Hash className="h-6 w-6 text-brand-500" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 uppercase tracking-wide font-semibold mb-1">Your Student ID</p>
                            <div className="flex items-center gap-3">
                                <p className="text-2xl font-mono font-bold text-white tracking-wide">{user.uniqueId || 'N/A'}</p>
                                <button
                                    onClick={copyId}
                                    className="text-neutral-500 hover:text-white transition-colors p-1.5 hover:bg-neutral-800 rounded-lg"
                                    title="Copy ID to clipboard"
                                >
                                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-neutral-500 mt-1">Share this with your teacher to get connected.</p>
                        </div>
                    </div>
                </div>

                {/* Resources Card */}
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-xl shadow-brand-900/20 flex flex-col justify-between min-h-[160px]">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold">My Resources</h3>
                            <p className="text-brand-100 text-sm">Access your Notion notes</p>
                        </div>
                        <BookOpen className="h-6 w-6 text-brand-100" />
                    </div>
                    {user.resourcesLink ? (
                        <a
                            href={user.resourcesLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl transition-colors text-sm font-bold w-full mt-auto"
                        >
                            Open Notion Page <ExternalLink className="h-4 w-4" />
                        </a>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-brand-200 bg-black/10 p-3 rounded-xl border border-white/5 mt-auto">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>No resources linked yet. Ask your teacher to add one.</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Column: Assignments */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Active Assignments */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-brand-500 rounded-full"></div>
                            <h3 className="text-xl font-bold text-white">Active Assignments</h3>
                            <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded-full">{activeAssignments.length}</span>
                        </div>

                        {activeAssignments.length === 0 ? (
                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500">
                                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-neutral-700" />
                                <p>You're all caught up! No active assignments.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {activeAssignments.map(assignment => (
                                    <div key={assignment.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-brand-500/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-xs font-bold text-brand-500 tracking-wider uppercase">{assignment.subject}</span>
                                                <h4 className="text-lg font-semibold text-white mt-1 group-hover:text-brand-400 transition-colors">{assignment.chapter}</h4>
                                            </div>
                                            <div className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Due: {assignment.dueDate}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <a
                                                href={assignment.instructionLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                View Instructions
                                            </a>

                                            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-neutral-400 font-semibold block uppercase tracking-wide">Step 1: Upload your work</label>
                                                    <a
                                                        href={assignment.submissionLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Folder className="h-3 w-3" /> Open Submission Folder
                                                    </a>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs text-neutral-400 font-semibold block uppercase tracking-wide">Step 2: Submit File Link</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="url"
                                                            placeholder="Paste the link of your uploaded file..."
                                                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-brand-500 outline-none"
                                                            value={submissionLinks[assignment.id] || ''}
                                                            onChange={e => handleLinkChange(assignment.id, e.target.value)}
                                                        />
                                                        <button
                                                            onClick={() => handleSubmit(assignment)}
                                                            disabled={!submissionLinks[assignment.id] || submittingIds.has(assignment.id)}
                                                            className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {submittingIds.has(assignment.id) ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Upload className="h-3 w-3" /> Submit</>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assignment History */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-neutral-700 rounded-full"></div>
                            <h3 className="text-xl font-bold text-white">History</h3>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                            {/* Scrollable container for max 5 items approx height */}
                            <div className="max-h-[350px] overflow-y-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-neutral-950 text-neutral-400 sticky top-0 z-10 shadow-sm border-b border-neutral-800">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Topic</th>
                                            <th className="px-6 py-4 font-medium">Due</th>
                                            <th className="px-6 py-4 font-medium">Assign Link</th>
                                            <th className="px-6 py-4 font-medium">Student Work</th>
                                            <th className="px-6 py-4 font-medium">Checked Copy</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {pastAssignments.map(assignment => (
                                            <tr key={assignment.id} className="hover:bg-neutral-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-medium">{assignment.chapter}</div>
                                                    <div className="text-neutral-500 text-xs">{assignment.subject}</div>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-400">
                                                    {assignment.dueDate}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a
                                                        href={assignment.instructionLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-brand-500 hover:text-brand-400 hover:underline flex items-center gap-1 text-xs"
                                                    >
                                                        View <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {assignment.studentWorkLink ? (
                                                        <a href={assignment.studentWorkLink} target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-white hover:underline text-xs">
                                                            View File
                                                        </a>
                                                    ) : (
                                                        <span className="text-neutral-600 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {assignment.checkedLink ? (
                                                        <a href={assignment.checkedLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 hover:underline">
                                                            <FileText className="h-3 w-3" /> View Checked
                                                        </a>
                                                    ) : (
                                                        <span className="text-neutral-500 text-xs italic">Pending check</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                        <CheckCircle className="h-3 w-3" /> Submitted
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Uploads & Queries */}
                <div className="lg:col-span-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                        {/* Collapsible Header */}
                        <button
                            onClick={() => setShowRequests(!showRequests)}
                            className="w-full flex items-center justify-between p-6 hover:bg-neutral-800/30 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                                    <UploadCloud className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-white">Request Resource</h3>
                                    <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">Submit queries or check history</p>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg bg-neutral-800 text-neutral-400 transition-transform duration-300 ${showRequests ? 'rotate-180 bg-neutral-700 text-white' : ''}`}>
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </button>

                        {/* Collapsible Content */}
                        {showRequests && (
                            <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                                <div className="h-px bg-neutral-800 w-full mb-6"></div>

                                {/* Form */}
                                <form onSubmit={handleResourceUpload} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all focus:border-brand-500/50"
                                            value={uploadForm.subject}
                                            onChange={e => setUploadForm({ ...uploadForm, subject: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Topic"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all focus:border-brand-500/50"
                                            value={uploadForm.topic}
                                            onChange={e => setUploadForm({ ...uploadForm, topic: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="url"
                                            placeholder="File Link (Upload to Drive first)"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none transition-all focus:border-brand-500/50"
                                            value={uploadForm.fileLink}
                                            onChange={e => setUploadForm({ ...uploadForm, fileLink: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            type="button"
                                            onClick={openUploadFolder}
                                            className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 py-1"
                                        >
                                            <ExternalLink className="h-3 w-3" /> Upload Folder
                                        </button>
                                        <button type="submit" disabled={isUploading} className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm shadow-lg shadow-brand-900/20 disabled:opacity-50">
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                                        </button>
                                    </div>
                                </form>

                                {/* History Section */}
                                <div className="mt-8 pt-6 border-t border-neutral-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-white">Your Request History</h3>
                                        <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">{queries.length}</span>
                                    </div>

                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                        {queries.length === 0 ? (
                                            <div className="text-center py-8 text-neutral-500 bg-neutral-950/50 rounded-xl border border-neutral-800 border-dashed">
                                                <p className="text-xs">No requests made yet.</p>
                                            </div>
                                        ) : (
                                            queries.map(q => (
                                                <div key={q.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 hover:border-brand-500/20 transition-colors group">
                                                    <div className="flex justify-between items-start gap-3">
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-white text-sm truncate">{q.topic}</div>
                                                            <div className="text-xs text-neutral-500 truncate">{q.subject} • {q.date}</div>
                                                        </div>
                                                        <button onClick={() => handleDeleteQuery(q.id)} className="text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${q.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                            {q.status.toUpperCase()}
                                                        </span>
                                                        {q.fileLink && (
                                                            <a href={q.fileLink} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                                                                <FileText className="h-3 w-3" /> File
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
