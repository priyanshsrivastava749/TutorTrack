import React, { useEffect, useState } from 'react';
import { User, Assignment, ResourceQuery } from '../types';
import { api } from '../services/api';
import { Users, Plus, Link as LinkIcon, Folder, FileText, ChevronDown, CheckCircle, Clock, AlertCircle, Eye, EyeOff, Trash2, ExternalLink, Save, Edit2, X, UploadCloud, CheckSquare, Square, Loader2 } from 'lucide-react';
import TypingEffect from './TypingEffect';

interface TeacherDashboardProps {
    user: User;
}

// --- Sub-component: Assignment Form ---
const StudentAssignmentForm = ({ student, teacherId, onAssign }: { student: User, teacherId: string, onAssign: () => void }) => {
    const [formData, setFormData] = useState({
        subject: '',
        chapter: '',
        instructionLink: '',
        submissionLink: student.submissionFolderLink || '',
        dueDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (student.submissionFolderLink) {
            setFormData(prev => ({ ...prev, submissionLink: student.submissionFolderLink || '' }));
        }
    }, [student.submissionFolderLink]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.addAssignment({
                studentId: student.id,
                teacherId: teacherId,
                subject: formData.subject,
                chapter: formData.chapter,
                instructionLink: formData.instructionLink,
                submissionLink: formData.submissionLink,
                dueDate: formData.dueDate,
                status: 'pending'
            });

            setFormData({
                subject: '',
                chapter: '',
                instructionLink: '',
                submissionLink: student.submissionFolderLink || '',
                dueDate: ''
            });
            onAssign();
        } catch (error) {
            alert("Failed to assign homework. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-4">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-brand-500" />
                Assign New Homework
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        required
                        type="text"
                        placeholder="Subject"
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    />
                    <input
                        required
                        type="text"
                        placeholder="Chapter/Topic"
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                        value={formData.chapter}
                        onChange={e => setFormData({ ...formData, chapter: e.target.value })}
                    />
                    <div className="relative">
                        <input
                            required
                            type="date"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none [color-scheme:dark]"
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        required
                        type="url"
                        placeholder="Instruction GDrive Link"
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                        value={formData.instructionLink}
                        onChange={e => setFormData({ ...formData, instructionLink: e.target.value })}
                    />
                    <input
                        required
                        type="url"
                        placeholder="Submission Folder Link"
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                        value={formData.submissionLink}
                        onChange={e => setFormData({ ...formData, submissionLink: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
                </button>
            </form>
        </div>
    );
};

// --- Sub-component: Checked Copy Cell ---
const CheckedCopyCell = ({ assignment, onUpdate }: { assignment: Assignment, onUpdate: () => void }) => {
    const [isEditing, setIsEditing] = useState(!assignment.checkedLink);
    const [link, setLink] = useState(assignment.checkedLink || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await api.updateAssignment({ ...assignment, checkedLink: link });
        setIsSaving(false);
        setIsEditing(false);
        onUpdate();
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-1 min-w-[150px]">
                <input
                    type="url"
                    placeholder="Paste Checked Link..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:border-brand-500 outline-none"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <button onClick={handleSave} disabled={isSaving} className="p-1 bg-brand-600 rounded text-white hover:bg-brand-500 disabled:opacity-50">
                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                </button>
                {assignment.checkedLink && (
                    <button onClick={() => setIsEditing(false)} className="p-1 text-neutral-400 hover:text-white">
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <a href={assignment.checkedLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                <FileText className="h-3 w-3" /> Checked Copy
            </a>
            <button onClick={() => setIsEditing(true)} className="text-neutral-500 hover:text-white p-1">
                <Edit2 className="h-3 w-3" />
            </button>
        </div>
    );
};


const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
    const [students, setStudents] = useState<User[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [queries, setQueries] = useState<ResourceQuery[]>([]);
    const [refresh, setRefresh] = useState(0);

    // View States
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

    // Add Student Form
    const [newStudentId, setNewStudentId] = useState('');
    const [addStudentError, setAddStudentError] = useState('');
    const [isAddingStudent, setIsAddingStudent] = useState(false);

    // Local state for resource inputs
    const [resourceInputs, setResourceInputs] = useState<Record<string, { notion: string, folder: string, uploadFolder: string }>>({});
    const [savingResources, setSavingResources] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const allUsers = await api.getUsers();
            const linkedStudents = allUsers.filter(u => u.role === 'student' && u.teacherIds?.includes(user.id));
            setStudents(linkedStudents);

            const allAssignments = await api.getAssignments();
            setAssignments(allAssignments);

            const allQueries = await api.getResourceQueries();
            setQueries(allQueries);

            // Initialize inputs
            const inputs: Record<string, { notion: string, folder: string, uploadFolder: string }> = {};
            linkedStudents.forEach(s => {
                inputs[s.id] = {
                    notion: s.resourcesLink || '',
                    folder: s.submissionFolderLink || '',
                    uploadFolder: s.resourceUploadLink || ''
                };
            });
            setResourceInputs(inputs);
        };
        fetchData();
    }, [user.id, refresh]);

    const handleLinkStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentId.trim()) return;
        setIsAddingStudent(true);

        try {
            console.log('Linking student:', newStudentId);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/link-student/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Token ${token}` } : {})
                },
                body: JSON.stringify({ student_code: newStudentId })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Link success:', data);
                alert('Student Linked Successfully');
                setNewStudentId('');
                setAddStudentError('');
                setRefresh(prev => prev + 1);
            } else {
                console.error('Link failed:', data);
                if (response.status === 404) {
                    alert('Student not found');
                } else {
                    alert(data.message || 'Failed to link student');
                }
                setAddStudentError(data.message || 'Failed to link student');
            }
        } catch (error) {
            console.error('Link error:', error);
            alert('An error occurred while linking the student.');
        } finally {
            setIsAddingStudent(false);
        }
    };

    const handleInputChange = (studentId: string, field: 'notion' | 'folder' | 'uploadFolder', value: string) => {
        setResourceInputs(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSaveResources = async (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        const inputs = resourceInputs[studentId];
        if (student && inputs) {
            setSavingResources(studentId);
            await api.updateUserResources({
                ...student,
                resourcesLink: inputs.notion,
                submissionFolderLink: inputs.folder,
                resourceUploadLink: inputs.uploadFolder
            });
            setSavingResources(null);
            setRefresh(prev => prev + 1);
        }
    };

    const handleDeleteAssignment = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            // Optimistic UI update could happen here, but we'll wait for API for safety
            await api.deleteAssignment(id);
            setRefresh(prev => prev + 1);
        }
    };

    const handleDeleteQuery = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("Delete this resource query?")) {
            await api.deleteResourceQuery(id);
            setRefresh(prev => prev + 1);
        }
    };

    const toggleQueryStatus = async (e: React.MouseEvent, query: ResourceQuery) => {
        e.preventDefault();
        e.stopPropagation();
        const newStatus = query.status === 'pending' ? 'resolved' : 'pending';
        await api.updateResourceQuery({ ...query, status: newStatus });
        setRefresh(prev => prev + 1);
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleVisibility = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setHiddenIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header & Add Student */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-neutral-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Teacher Dashboard</h1>
                    <div className="flex flex-col gap-1">
                        <p className="text-neutral-400">Manage your students, assignments, and resources.</p>
                        <div className="text-sm font-semibold mt-1">
                            <TypingEffect words={["Architectured by Priyansh", "Manage with Ease", "Track Progress Real-time"]} />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleLinkStudent} className="w-full md:w-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter Student ID (e.g. STU-003)"
                            className="w-full md:w-64 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                            value={newStudentId}
                            onChange={(e) => setNewStudentId(e.target.value)}
                        />
                        <button type="submit" disabled={isAddingStudent} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-500 transition-colors flex items-center gap-2 disabled:opacity-50">
                            {isAddingStudent ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Add</>}
                        </button>
                    </div>
                    {addStudentError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {addStudentError}</p>}
                </form>
            </div>

            {/* Student List */}
            <div className="space-y-4">
                {students.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 bg-neutral-900/30 rounded-2xl border border-neutral-800 border-dashed">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No students linked yet. Add a student ID above to get started.</p>
                    </div>
                ) : (
                    students.map(student => {
                        const isExpanded = expandedIds.has(student.id);
                        const isHidden = hiddenIds.has(student.id);

                        // Safe copy and sort to avoid mutation issues and ensure unique keys
                        const studentAssignments = [...assignments]
                            .filter(a => a.studentId === student.id)
                            .reverse();

                        const studentQueries = [...queries]
                            .filter(q => q.studentId === student.id)
                            .reverse();

                        const inputs = resourceInputs[student.id] || { notion: '', folder: '', uploadFolder: '' };

                        return (
                            <div
                                key={student.id}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-neutral-900/40 border-brand-500/30 shadow-lg' : 'bg-neutral-900 border-neutral-800'
                                    }`}
                            >
                                {/* Header Row */}
                                <div
                                    onClick={() => toggleExpand(student.id)}
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-neutral-800/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg ${isExpanded ? 'bg-brand-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                                            {student.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{student.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${isHidden ? 'bg-neutral-800 text-neutral-500 border-neutral-700' : 'bg-brand-900/20 text-brand-300 border-brand-500/20'}`}>
                                                    {isHidden ? 'HIDDEN' : student.uniqueId}
                                                </span>
                                                <button
                                                    onClick={(e) => toggleVisibility(e, student.id)}
                                                    className="p-1 hover:bg-neutral-800 rounded-md text-neutral-500 hover:text-white transition-colors"
                                                >
                                                    {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-neutral-800 text-white' : 'text-neutral-500'}`}>
                                        <ChevronDown className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-6 border-t border-neutral-800/50 bg-black/20">

                                        {/* Resources & Links Config Section */}
                                        <div className="py-6 border-b border-neutral-800/50">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                    <LinkIcon className="h-4 w-4 text-brand-500" />
                                                    Resources & Settings
                                                </h3>
                                                {!isHidden && (
                                                    <button
                                                        onClick={() => handleSaveResources(student.id)}
                                                        disabled={savingResources === student.id}
                                                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                                    >
                                                        {savingResources === student.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                                        Save Changes
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Notion Page Link</label>
                                                    <input
                                                        type={isHidden ? "password" : "url"}
                                                        placeholder="Paste Notion Link..."
                                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none text-sm"
                                                        value={inputs.notion}
                                                        onChange={(e) => handleInputChange(student.id, 'notion', e.target.value)}
                                                        readOnly={isHidden}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Default Assignment Folder</label>
                                                    <input
                                                        type={isHidden ? "password" : "url"}
                                                        placeholder="Where students submit homework..."
                                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none text-sm"
                                                        value={inputs.folder}
                                                        onChange={(e) => handleInputChange(student.id, 'folder', e.target.value)}
                                                        readOnly={isHidden}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-brand-400 uppercase tracking-wide font-semibold">Resource Upload Folder</label>
                                                    <input
                                                        type={isHidden ? "password" : "url"}
                                                        placeholder="Where students upload requests..."
                                                        className="w-full bg-neutral-950 border border-brand-900/50 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none text-sm"
                                                        value={inputs.uploadFolder}
                                                        onChange={(e) => handleInputChange(student.id, 'uploadFolder', e.target.value)}
                                                        readOnly={isHidden}
                                                    />
                                                </div>
                                            </div>
                                            {isHidden && <p className="text-xs text-neutral-500 mt-2 italic">* Unhide details to edit links</p>}
                                        </div>

                                        {/* Assignment Form */}
                                        <StudentAssignmentForm
                                            student={student}
                                            teacherId={user.id}
                                            onAssign={() => setRefresh(p => p + 1)}
                                        />

                                        {/* Assignment History Table */}
                                        <div className="mt-8">
                                            <h3 className="text-sm font-bold text-white mb-4">Assignment History</h3>
                                            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                                                <div className="max-h-[350px] overflow-y-auto">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="bg-neutral-900 text-neutral-400 sticky top-0 z-10 shadow-sm">
                                                            <tr>
                                                                <th className="px-4 py-3 font-medium">Topic</th>
                                                                <th className="px-4 py-3 font-medium">Due</th>
                                                                <th className="px-4 py-3 font-medium">Assign Link</th>
                                                                <th className="px-4 py-3 font-medium">Student Work</th>
                                                                <th className="px-4 py-3 font-medium">Checked Copy</th>
                                                                <th className="px-4 py-3 font-medium text-center">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-neutral-800">
                                                            {studentAssignments.map(a => (
                                                                <tr key={a.id} className="hover:bg-neutral-800/30 transition-colors">
                                                                    <td className="px-4 py-3">
                                                                        <div className="font-medium text-white">{a.chapter}</div>
                                                                        <div className="text-neutral-500 text-[10px] uppercase">{a.subject}</div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-neutral-400">{a.dueDate}</td>
                                                                    <td className="px-4 py-3">
                                                                        <a href={a.instructionLink} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline flex items-center gap-1">
                                                                            View <ExternalLink className="h-3 w-3" />
                                                                        </a>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {a.status === 'submitted' && a.studentWorkLink ? (
                                                                            <a href={a.studentWorkLink} target="_blank" rel="noreferrer" className="text-green-500 hover:underline flex items-center gap-1">
                                                                                <CheckCircle className="h-3 w-3" /> Submitted File
                                                                            </a>
                                                                        ) : a.status === 'submitted' ? (
                                                                            <span className="text-green-500 flex items-center gap-1">
                                                                                <CheckCircle className="h-3 w-3" /> Done (No Link)
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-yellow-600 flex items-center gap-1">
                                                                                <Clock className="h-3 w-3" /> Pending
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <CheckedCopyCell assignment={a} onUpdate={() => setRefresh(p => p + 1)} />
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => handleDeleteAssignment(e, a.id)}
                                                                            className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer relative z-20 pointer-events-auto"
                                                                            title="Delete Assignment"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {studentAssignments.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                                                                        No assignments recorded.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Student Resource Queries Table */}
                                        <div className="mt-8">
                                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                <UploadCloud className="h-4 w-4 text-brand-500" />
                                                Student Resource Queries (Uploads)
                                            </h3>
                                            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="bg-neutral-900 text-neutral-400 sticky top-0 z-10 shadow-sm">
                                                            <tr>
                                                                <th className="px-4 py-3 font-medium">Date</th>
                                                                <th className="px-4 py-3 font-medium">Subject</th>
                                                                <th className="px-4 py-3 font-medium">Topic/Chapter</th>
                                                                <th className="px-4 py-3 font-medium">Student File</th>
                                                                <th className="px-4 py-3 font-medium">Status</th>
                                                                <th className="px-4 py-3 font-medium text-center">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-neutral-800">
                                                            {studentQueries.map(q => (
                                                                <tr key={q.id} className="hover:bg-neutral-800/30 transition-colors">
                                                                    <td className="px-4 py-3 text-neutral-500">{q.date}</td>
                                                                    <td className="px-4 py-3 text-white font-medium">{q.subject}</td>
                                                                    <td className="px-4 py-3 text-neutral-300">{q.topic}</td>
                                                                    <td className="px-4 py-3">
                                                                        <a href={q.fileLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                                                            <FileText className="h-3 w-3" /> View File
                                                                        </a>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => toggleQueryStatus(e, q)}
                                                                            className={`flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors border ${q.status === 'resolved'
                                                                                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                                                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'
                                                                                }`}
                                                                        >
                                                                            {q.status === 'resolved' ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                                                                            {q.status}
                                                                        </button>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => handleDeleteQuery(e, q.id)}
                                                                            className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer relative z-20 pointer-events-auto"
                                                                            title="Delete Query"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {studentQueries.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                                                                        No resource queries uploaded by student.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
