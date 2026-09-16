import { useState } from 'react';
import {
  Clock, CheckCircle2, AlertTriangle, Briefcase, TrendingUp,
  ArrowRight, Edit3, MapPin, Calendar, IndianRupee,
  Send, MessageSquare, Phone, Mail, FileText, UserCheck,
  GraduationCap,
} from 'lucide-react';
import { Card, SectionTitle, Badge, EvidenceBadge } from '@/components/ui';
import { useTrainee, type OutcomeUpdate, type OutcomeStatus } from '@/context/TraineeContext';
import { UpdateOutcomeModal } from '@/pages/trainee/UpdateOutcomeModal';
import { FollowUpFormModal } from '@/pages/trainee/FollowUpFormModal';
import { followUpStatusColors, type FollowUpMethod, type FollowUpStatus } from '@/data/mockData';

const isEmployedStatus = (status?: OutcomeStatus) => status === 'Placed' || status === 'Self-Employed' || status === 'Apprenticeship';

export function FollowUpTimeline() {
  const { followUps, followUpUpdates } = useTrainee();
  const [modalPeriod, setModalPeriod] = useState<string | null>(null);
  const [formModalPeriod, setFormModalPeriod] = useState<string | null>(null);
  const [simulatedSends, setSimulatedSends] = useState<Record<string, string>>({});

  const stages = ['30 Days', '90 Days', '180 Days', '365 Days'];
  const stageColors: Record<string, string> = {
    '30 Days': 'bg-brand-500',
    '90 Days': 'bg-accent-500',
    '180 Days': 'bg-emerald-500',
    '365 Days': 'bg-violet-500',
  };

  const handleSimulateSend = (period: string, method: FollowUpMethod) => {
    const timestamp = new Date().toLocaleString('en-IN');
    setSimulatedSends((prev) => ({ ...prev, [period]: `${method} reminder simulated at ${timestamp}` }));
  };

  return (
    <Card className="p-5">
      <SectionTitle
        title="Follow-Up Timeline"
        subtitle="Track your employment journey across 30 / 90 / 180 / 365 days"
        icon={<Clock className="h-5 w-5" />}
      />

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 sm:left-6" />

        <div className="space-y-6">
          {stages.map((stage) => {
            const fu = followUps.find((f) => f.period === stage);
            if (!fu) return null;
            const stageUpdate = followUpUpdates[stage];
            const isCompleted = fu.responded || !!stageUpdate;
            const isPending = !fu.responded && !stageUpdate;
            const isOverdue = fu.isOverdue;
            const currentStatus = fu.status || (isCompleted ? 'Completed' : 'Pending');

            return (
              <div key={stage} className="relative pl-12 sm:pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md sm:h-12 sm:w-12 ${stageColors[stage]}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : isOverdue ? (
                    <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : (
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6" />
                  )}
                </div>

                {/* Stage card */}
                <div className={`rounded-xl border p-4 transition-all ${
                  isOverdue ? 'border-rose-300 dark:border-rose-800'
                  : isCompleted ? 'border-gray-200 dark:border-gray-700'
                  : 'border-amber-200 dark:border-amber-800'
                }`}>
                  {/* Stage header */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{stage}</h3>
                      <StatusBadge status={currentStatus} />
                      {fu.method && <MethodBadge method={fu.method} />}
                      {stageUpdate && (
                        <Badge color="brand" size="sm"><Edit3 className="mr-1 h-3 w-3" /> Self-Reported</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => setFormModalPeriod(stage)}
                            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
                          >
                            <FileText className="h-3.5 w-3.5" /> Fill Follow-Up Form
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setModalPeriod(stage)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Update Outcome
                      </button>
                    </div>
                  </div>

                  {/* Due date & last contacted */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    {fu.dueDate && (
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due: {fu.dueDate}</span>
                    )}
                    {fu.lastContacted && (
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> Last contacted: {fu.lastContacted}</span>
                    )}
                    {fu.nextFollowUp && (
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Next: {fu.nextFollowUp}</span>
                    )}
                  </div>

                  {stageUpdate && (
                    <p className="mt-2 text-xs text-gray-400">Last updated: {stageUpdate.submittedAt}</p>
                  )}

                  {/* Overdue warning */}
                  {isOverdue && !stageUpdate && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2.5 dark:bg-rose-900/20">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      <div>
                        <p className="text-xs font-medium text-rose-700 dark:text-rose-300">Overdue Follow-Up</p>
                        <p className="text-xs text-rose-600 dark:text-rose-400">
                          This follow-up was due on {fu.dueDate} and has not received a response. Please complete the follow-up form or contact your training provider.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status grid */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Employment status */}
                    <StatusCell
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Employment Status"
                      value={
                        stageUpdate
                          ? !isEmployedStatus(stageUpdate.employmentStatus)
                            ? 'Still Searching'
                            : stageUpdate.employmentStatus === 'Placed'
                            ? 'Employed'
                            : stageUpdate.employmentStatus === 'Self-Employed'
                            ? 'Self-Employed'
                            : 'Apprenticeship'
                          : fu.employed
                          ? fu.livelihoodStatus
                          : 'Not Employed'
                      }
                      positive={stageUpdate ? isEmployedStatus(stageUpdate.employmentStatus) : fu.employed}
                    />

                    {/* Relevant employment */}
                    <StatusCell
                      icon={<TrendingUp className="h-4 w-4" />}
                      label="Relevant Employment"
                      value={
                        stageUpdate
                          ? !isEmployedStatus(stageUpdate.employmentStatus)
                            ? 'N/A'
                            : (stageUpdate.jobRelevance || 'N/A')
                          : fu.relevant
                          ? 'Yes'
                          : fu.employed
                          ? 'Low Relevance'
                          : 'N/A'
                      }
                      positive={stageUpdate ? stageUpdate.jobRelevance === 'High' : fu.relevant}
                    />

                    {/* Retention status */}
                    <StatusCell
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      label="Retention Status"
                      value={
                        fu.retained || (stageUpdate && isEmployedStatus(stageUpdate.employmentStatus) && (stage === '180 Days' || stage === '365 Days'))
                          ? 'Retained'
                          : fu.employed || (stageUpdate && isEmployedStatus(stageUpdate.employmentStatus))
                          ? 'In Progress'
                          : 'N/A'
                      }
                      positive={fu.retained || Boolean(stageUpdate && isEmployedStatus(stageUpdate.employmentStatus) && (stage === '180 Days' || stage === '365 Days'))}
                    />

                    {/* Evidence */}
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Evidence Level</span>
                      </div>
                      <div className="mt-1.5"><EvidenceBadge state={stageUpdate ? 'Self-Reported' : fu.evidence} /></div>
                    </div>
                  </div>

                  {/* Follow-up form response details */}
                  {fu.formResponse && !stageUpdate && (
                    <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <FileText className="h-3.5 w-3.5" /> Follow-Up Form Response
                      </p>
                      <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                        {fu.formResponse.occupation && <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><Briefcase className="h-3 w-3" /> {fu.formResponse.occupation}</span>}
                        {fu.formResponse.employer && <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><UserCheck className="h-3 w-3" /> {fu.formResponse.employer}</span>}
                        {fu.formResponse.location && <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><MapPin className="h-3 w-3" /> {fu.formResponse.location}</span>}
                        {fu.formResponse.wageRange && <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><IndianRupee className="h-3 w-3" /> {fu.formResponse.wageRange}</span>}
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <GraduationCap className="h-3 w-3" /> Using skills: {fu.formResponse.usingSkills ? 'Yes' : 'No'}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <TrendingUp className="h-3 w-3" /> Needs training: {fu.formResponse.needsTraining ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {fu.formResponse.comments && (
                        <p className="mt-2 flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <MessageSquare className="h-3 w-3 shrink-0 mt-0.5" /> {fu.formResponse.comments}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Detail row if there's a stage update */}
                  {stageUpdate && isEmployedStatus(stageUpdate.employmentStatus) && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800">
                      {stageUpdate.jobRole && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {stageUpdate.jobRole}</span>}
                      {stageUpdate.industry && <span>{stageUpdate.industry}</span>}
                      {stageUpdate.jobLocation && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {stageUpdate.jobLocation}</span>}
                      {stageUpdate.joiningDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {stageUpdate.joiningDate}</span>}
                      {stageUpdate.salaryRange && <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {stageUpdate.salaryRange}</span>}
                    </div>
                  )}

                  {/* Simulate send buttons for pending follow-ups */}
                  {isPending && !stageUpdate && (
                    <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                      <p className="mb-2 text-xs font-medium text-gray-500">Simulate sending a reminder (demo only):</p>
                      <div className="flex flex-wrap gap-2">
                        <SimulateButton icon={<MessageSquare className="h-3.5 w-3.5" />} label="WhatsApp" onClick={() => handleSimulateSend(stage, 'WhatsApp')} />
                        <SimulateButton icon={<MessageSquare className="h-3.5 w-3.5" />} label="SMS" onClick={() => handleSimulateSend(stage, 'SMS')} />
                        <SimulateButton icon={<Mail className="h-3.5 w-3.5" />} label="Email" onClick={() => handleSimulateSend(stage, 'Email')} />
                        <SimulateButton icon={<Phone className="h-3.5 w-3.5" />} label="Phone Call" onClick={() => handleSimulateSend(stage, 'Phone Call')} />
                      </div>
                      {simulatedSends[stage] && (
                        <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
                          <Send className="h-3 w-3" /> {simulatedSends[stage]}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pending notice */}
                  {isPending && !stageUpdate && !isOverdue && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        This follow-up hasn't been completed yet. Click "Fill Follow-Up Form" to report your current status.
                      </p>
                    </div>
                  )}
                </div>

                {/* Arrow connector */}
                <div className="absolute left-3 top-12 hidden text-gray-300 dark:text-gray-600 sm:block sm:left-5">
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Follow-up responses are self-reported in this demo. Missing follow-up does not mean unemployed — it means we haven't heard back yet. No real WhatsApp/SMS/email is sent. All data resets on logout.
      </p>

      <UpdateOutcomeModal
        open={modalPeriod !== null}
        onClose={() => setModalPeriod(null)}
        periodLabel={modalPeriod || undefined}
      />
      <FollowUpFormModal
        open={formModalPeriod !== null}
        onClose={() => setFormModalPeriod(null)}
        periodLabel={formModalPeriod || undefined}
      />
    </Card>
  );
}

function StatusBadge({ status }: { status: FollowUpStatus }) {
  const colorClass = followUpStatusColors[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

function MethodBadge({ method }: { method: FollowUpMethod }) {
  const icons: Record<FollowUpMethod, React.ReactNode> = {
    'WhatsApp': <MessageSquare className="h-3 w-3" />,
    'SMS': <MessageSquare className="h-3 w-3" />,
    'Email': <Mail className="h-3 w-3" />,
    'Phone Call': <Phone className="h-3 w-3" />,
    'Assisted Follow-up': <UserCheck className="h-3 w-3" />,
  };
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      {icons[method]} {method}
    </span>
  );
}

function SimulateButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-900/20 dark:hover:text-brand-300"
    >
      {icon} {label}
    </button>
  );
}

function StatusCell({ icon, label, value, positive }: { icon: React.ReactNode; label: string; value: string; positive: boolean }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`mt-1.5 text-sm font-medium ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
}
