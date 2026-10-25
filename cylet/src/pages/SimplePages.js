import React, { useState } from 'react';
import { Icon } from '../components/Icons.js';

// ==================== ABOUT PAGE ====================
export const AboutPage = ({ setActivePage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-amber-400 text-slate-900 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Our Story & Values
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Nourishing Communities with Farm-Fresh Food Since 2012
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
            Cylet started as a modest neighborhood grocer. Today, we're proud to operate our premier supermarket located on Siakago Road (near Kubukubu Rd.) in Embu, Kenya, partnering with local regional farmers to bring wholesome, fresh groceries to your family's table.
          </p>
        </div>
      </div>

      {/* Key Milestones / Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Supermarket Branches', value: '10', sub: 'Embu & Mt. Kenya region' },
          { label: 'Local Farm Partners', value: '120+', sub: 'Fresh & family-owned' },
          { label: 'Weekly Fresh Deliveries', value: '50,000+', sub: 'To local families' },
          { label: 'Freshness Satisfaction', value: '99.8%', sub: 'Guaranteed or refunded' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400">{stat.value}</span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{stat.label}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">What Drives Us</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">The Cylet Promise</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Icon name="Sprout" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Direct From Soil to Shelf</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We cut out unnecessary wholesalers and distributors. Produce harvested in the dawn hours reaches our 11 branch shelves and your doorstep within 24 to 36 hours.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
              <Icon name="ShieldCheck" className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">100% Quality Guarantee</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every single avocado, steak, and bunch of spinach is individually checked by trained in-store specialists. If you aren't completely delighted, we replace it instantly.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center">
              <Icon name="Heart" className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Community & Sustainability</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We donate 100% of unsold day-end bread and produce to neighborhood food banks, utilize 100% recyclable cold packaging, and support clean EV delivery fleets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CAREERS PAGE ====================
export const CareersPage = ({ addToast }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  const OPEN_ROLES = [
    {
      id: 'job-1',
      title: 'Senior Produce Specialist & Buyer',
      branch: 'Central Supply Hub & Downtown Flagship',
      type: 'Full-Time',
      salary: 'KSh 85,000 - KSh 120,000 / mo',
      description: 'Liaise with local organic farms, evaluate seasonal fruit/vegetable harvests, and lead quality inspections.',
    },
    {
      id: 'job-2',
      title: 'Artisan Head Baker',
      branch: 'Cylet Supermarket - Embu Main Branch',
      type: 'Full-Time',
      salary: 'KSh 45,000 - KSh 65,000 / mo',
      description: 'Hand-shape sourdough boules, bake butter croissants, and oversee 5 AM morning oven bakes.',
    },
    {
      id: 'job-3',
      title: 'E-Commerce Personal Shopper',
      branch: 'Cylet Express - Kubukubu Road Junction',
      type: 'Part-Time / Full-Time',
      salary: 'KSh 30,000 - KSh 40,000 / mo',
      description: 'Carefully select top-quality produce and groceries for online delivery orders and stage curbside pickups.',
    },
    {
      id: 'job-4',
      title: 'Master Meat Butcher',
      branch: 'Cylet Supermarket - Embu Main Branch',
      type: 'Full-Time',
      salary: 'KSh 50,000 - KSh 70,000 / mo',
      description: 'Custom cut grass-fed Angus steaks, prepare specialty roasts, and maintain immaculate cold storage cases.',
    },
    {
      id: 'job-5',
      title: 'Customer Experience & Cashier Lead',
      branch: 'Cylet Supermarket - Kangaru Branch',
      type: 'Full-Time',
      salary: 'KSh 35,000 - KSh 45,000 / mo',
      description: 'Welcome supermarket guests, coordinate front-end checkout lanes, and assist with store inquiries.',
    },
  ];

  const handleApply = (e) => {
    e.preventDefault();
    addToast({
      title: 'Application Submitted!',
      message: `Thank you, ${applicantName}. Our hiring team will contact you regarding the ${selectedRole.title} position.`,
      type: 'success',
    });
    setSelectedRole(null);
    setApplicantName('');
    setApplicantEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-200">
      {/* Careers Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <span className="bg-orange-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Join Our Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Build a Wholesome Career in Grocery & Food
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            We offer competitive compensation, comprehensive health benefits, generous 20% in-store grocery discounts, and real career advancement across our 11 locations.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-3xl font-black text-amber-300">5 New Roles</span>
          <p className="text-xs text-slate-300 mt-1">Hiring immediately for Fall</p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: '20% Grocery Discount', desc: 'Save on your household grocery bills at Cylet.' },
          { title: 'Health & Dental Care', desc: 'Comprehensive medical insurance for full-time associates.' },
          { title: 'Flexible Scheduling', desc: 'Morning, afternoon, and weekend shifts to fit your life.' },
          { title: 'Paid Training & Growth', desc: 'Apprenticeship paths for butchery, bakery, and management.' },
        ].map((benefit, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
              ★
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{benefit.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>

      {/* Open Roles List */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Current Open Opportunities</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Click any position to review details and apply</p>
        </div>

        <div className="space-y-3">
          {OPEN_ROLES.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{role.title}</h3>
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {role.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{role.salary}</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{role.branch}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">{role.description}</p>
              </div>

              <button
                onClick={() => setSelectedRole(role)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors self-start md:self-auto shrink-0 shadow-sm"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedRole && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Job Application Form"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedRole(null)}
              className="absolute top-5 right-5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              aria-label="Close application modal"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Application Form
              </span>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white leading-tight">
                {selectedRole.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{selectedRole.branch}</p>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. David Kamau"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Years of Grocery Experience</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer">
                  <option>Entry-level / No prior grocery experience</option>
                  <option>1 - 2 years in retail / food</option>
                  <option>3 - 5 years experienced</option>
                  <option>5+ years senior</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== CONTACT PAGE ====================
export const ContactPage = ({ addToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Order Status & Delivery',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const FAQS = [
    {
      q: 'How does curbside pickup work at the 11 branches?',
      a: 'Choose "Branch Curbside Pickup" during checkout and select your local branch. When you arrive at our designated curbside bays, notify us or park in spots #1-#6. A team member will load your groceries into your vehicle within 5 minutes.',
    },
    {
      q: 'What is the cutoff time for same-day delivery?',
      a: 'Orders placed before 6:00 PM are delivered same-day in your chosen 2-hour delivery window. Any order placed after 6:00 PM can be scheduled for morning delivery starting at 8:00 AM tomorrow.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept all major Visa and MasterCard credit/debit cards, M-Pesa mobile money (instant STK push prompt), and Cash/Card on Delivery at your doorstep.',
    },
    {
      q: 'What is your freshness refund policy?',
      a: 'If any produce, meat, or bakery item arrives less than 100% fresh, simply tap "Need Help" or email us within 7 days for an unconditional instant replacement or refund.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({
      title: 'Message Sent!',
      message: 'Our customer support team will reply to your email within 2 hours.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-200">
      {/* Contact Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
            24/7 Customer Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            We're Always Here to Help
          </h1>
          <p className="text-emerald-100 text-sm mt-2 max-w-lg">
            Have a question about an order, feedback on a branch visit, or need assistance? Reach out anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs">
            <span className="text-emerald-200 block">Customer Telephone Desk</span>
            <a href="tel:+254202003310" className="text-base font-bold text-white hover:text-emerald-300 transition-colors">+254 20 2003310</a>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs">
            <span className="text-emerald-200 block">Customer Email Support</span>
            <a href="mailto:cyletsupermarkets@gmail.com" className="text-sm font-bold text-white hover:text-emerald-300 transition-colors">cyletsupermarkets@gmail.com</a>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs">
            <span className="text-emerald-200 block">Store Location</span>
            <span className="text-xs font-bold text-white">Siakago Rd (near Kubukubu Rd.), Embu</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Send an Inquiry</h2>

          {submitted ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Icon name="Check" className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg text-emerald-950 dark:text-emerald-200">Inquiry Received</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Thank you for contacting Cylet Supermarket. A customer care coordinator has been assigned to your ticket and will email you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Inquiry Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option>Order Status & Delivery</option>
                  <option>Branch Feedback & Suggestion</option>
                  <option>Missing or Damaged Item</option>
                  <option>Local Farm / Supplier Partnership</option>
                  <option>General Customer Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                    className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white gap-3"
                  >
                    <span>{faq.q}</span>
                    <Icon
                      name={isOpen ? 'Minus' : 'Plus'}
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
