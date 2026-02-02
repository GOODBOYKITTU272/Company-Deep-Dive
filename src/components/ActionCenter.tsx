import { AlertCircle, Clock, User, Send } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  priority: 'high' | 'medium' | 'low';
  company: string;
  role: string;
  reason: string;
  owner: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const tasks: Task[] = [
  {
    id: '1',
    priority: 'high',
    company: 'Microsoft',
    role: 'Software Engineer',
    reason: '87 roles posted in 24h - urgent spike',
    owner: 'Sarah Chen',
    dueDate: 'Today',
    status: 'pending',
  },
  {
    id: '2',
    priority: 'high',
    company: 'Google',
    role: 'Product Manager',
    reason: 'Hiring intent score 89 - strong signal',
    owner: 'Unassigned',
    dueDate: 'Today',
    status: 'pending',
  },
  {
    id: '3',
    priority: 'medium',
    company: 'Amazon',
    role: 'Data Scientist',
    reason: 'Cloud roles expanding - 68 openings',
    owner: 'Mike Rodriguez',
    dueDate: 'Tomorrow',
    status: 'in-progress',
  },
  {
    id: '4',
    priority: 'medium',
    company: 'Stripe',
    role: 'Backend Engineer',
    reason: 'New office opening - 24 roles',
    owner: 'Sarah Chen',
    dueDate: 'Jan 13',
    status: 'pending',
  },
  {
    id: '5',
    priority: 'low',
    company: 'Adobe',
    role: 'Product Designer',
    reason: 'Steady hiring - 28 roles',
    owner: 'Alex Kim',
    dueDate: 'Jan 14',
    status: 'pending',
  },
];

export function ActionCenter() {
  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [message, setMessage] = useState('');

  const generateMessage = () => {
    const msg = `Hi [Recruiter Name],

I noticed ${selectedTask.company} just posted ${selectedTask.reason.match(/\d+/)?.[0] || '87'} ${selectedTask.role} openings. We work with top-tier tech companies to accelerate their hiring timelines.

We have a pre-vetted pool of senior ${selectedTask.role}s who've cleared technical assessments and are ready to interview within 48 hours.

Would you be open to a quick call this week to explore how we can help you fill these roles faster?

Best regards,
[Your Name]
APPLYWIZZ Hiring Intelligence`;

    setMessage(msg);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Action Center</h1>
        <p className="text-gray-600">Outreach & Execution Dashboard</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Task Queue */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Outreach Queue</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                All
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100">High</button>
              <button className="px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100">My Tasks</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Due
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedTask.id === task.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded text-blue-700 text-xs font-semibold flex items-center justify-center">
                          {task.company.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{task.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{task.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{task.reason}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{task.owner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{task.dueDate}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Composer */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Outreach Message</h3>
            <p className="text-sm text-gray-600">AI-generated for {selectedTask.company}</p>
          </div>

          <div className="mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Context</p>
                  <p className="text-sm text-blue-800">{selectedTask.reason}</p>
                </div>
              </div>
            </div>
            <button
              onClick={generateMessage}
              className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-4"
            >
              Generate Message
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Click 'Generate Message' to create AI-powered outreach..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Owner</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">
              <option>Sarah Chen</option>
              <option>Mike Rodriguez</option>
              <option>Alex Kim</option>
              <option>Unassigned</option>
            </select>
          </div>

          <div className="space-y-3">
            <button className="w-full px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Send Outreach
            </button>
            <button className="w-full px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              Schedule Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
