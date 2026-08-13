import { Link } from 'react-router-dom';
import { useResourceRequest } from '../../hooks/useResourceRequest';
import { InlineError } from '../../components/ui/ErrorState';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import { useEffect } from 'react';

const RESOURCE_TYPES = [
  'Notes',
  'Previous Year Papers (PYQ)',
  'Practical File',
  'Viva Questions',
  'Question Bank',
  'Syllabus',
  'Lab Manual',
  'Other',
];

const INFO_CARDS = [
  {
    icon: 'support_agent',
    title: 'Fast Response',
    desc: 'Our community admins review requests within 24 hours.',
  },
  {
    icon: 'groups',
    title: 'Community Powered',
    desc: 'Requests are fulfilled by verified student contributors.',
  },
  {
    icon: 'verified',
    title: 'Curated Quality',
    desc: 'All uploaded resources are reviewed before publishing.',
  },
];

function Contact() {
  const { formData, handleChange, handleSubmit, status, errorMessage } = useResourceRequest();
  const { toasts, addToast, removeToast } = useToast();

  // Show toast on success
  useEffect(() => {
    if (status === 'success') {
      addToast({
        message: '✅ Request submitted! We\'ll get back to you soon.',
        type: 'success',
        duration: 5000,
      });
    }
    if (status === 'error' && errorMessage) {
      addToast({ message: errorMessage, type: 'error', duration: 5000 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <div className="bg-[#FFF8EC] text-on-surface font-body-md min-h-screen pt-24 pb-16">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-secondary font-label-lg text-label-lg">
          <Link className="hover:text-amber-600 opacity-70 transition-colors font-medium" to="/">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-black font-extrabold">Request a Resource</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-black text-4xl text-black mb-4">
            Can't Find What You Need?
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed font-medium">
            Fill in the form below and our student community will track down the resource for you. Most requests are fulfilled within 24 hours.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Column */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-md border-2 border-amber-300/80">
              {/* Success message */}
              {isSuccess && (
                <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-4">
                  <span className="material-symbols-outlined text-emerald-600 text-3xl shrink-0">check_circle</span>
                  <div>
                    <p className="font-extrabold text-emerald-800 text-lg">Request Submitted!</p>
                    <p className="text-emerald-700 text-sm mt-1 font-medium">
                      Thank you! Our community will review your request and upload the resource as soon as possible.
                      If you provided your email, we'll notify you when it's ready.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate aria-label="Resource request form">
                <div className="space-y-6">
                  {/* Subject Code */}
                  <div>
                    <label htmlFor="subjectCode" className="block font-bold text-sm mb-2 text-black">
                      Subject Code <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="subjectCode"
                      type="text"
                      value={formData.subjectCode}
                      onChange={(e) => handleChange('subjectCode', e.target.value)}
                      placeholder="e.g. CE0516, MA0311"
                      className="w-full px-4 py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Resource Type */}
                  <div>
                    <label htmlFor="resourceType" className="block font-bold text-sm mb-2 text-black">
                      Resource Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="resourceType"
                        value={formData.resourceType}
                        onChange={(e) => handleChange('resourceType', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black appearance-none cursor-pointer"
                        disabled={isLoading}
                      >
                        {RESOURCE_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block font-bold text-sm mb-2 text-black">
                      Describe What You Need <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="e.g. I need handwritten notes for Unit 3 of Data Structures (CE0417) — specifically trees and graphs..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black resize-none"
                      disabled={isLoading}
                      required
                      aria-required="true"
                    />
                    {errorMessage && <InlineError message={errorMessage} />}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="requesterEmail" className="block font-bold text-sm mb-2 text-black">
                      Your Email <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(must be @gmail.com)</span>
                    </label>
                    <input
                      id="requesterEmail"
                      type="email"
                      value={formData.requesterEmail}
                      onChange={(e) => handleChange('requesterEmail', e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-sm font-semibold text-black"
                      disabled={isLoading}
                      required
                      aria-required="true"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className="w-full btn-black-yellow py-4 rounded-xl font-extrabold text-base transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active-press"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : isSuccess ? (
                      <>
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Request Submitted!
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:w-1/3 space-y-6">
            {/* Info Cards */}
            {INFO_CARDS.map((card) => (
              <div key={card.icon} className="bg-white rounded-[20px] p-6 border-2 border-amber-300/80 hover:border-black shadow-sm flex gap-4 items-start transition-all">
                <div className="bg-[#FEF3D6] border border-amber-400 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-black text-[24px]">{card.icon}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-black text-sm mb-1">{card.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed font-medium">{card.desc}</p>
                </div>
              </div>
            ))}

            {/* Alternative CTA */}
            <div className="bg-navy-accent rounded-[20px] p-6 text-white text-center space-y-4">
              <span className="material-symbols-outlined text-4xl block">chat</span>
              <h3 className="font-bold text-lg">Prefer Live Help?</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Join our WhatsApp community for real-time answers from seniors and mentors.
              </p>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-navy-accent py-2.5 rounded-xl font-button font-semibold text-sm hover:bg-surface-variant transition-colors"
              >
                Join WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default Contact;
