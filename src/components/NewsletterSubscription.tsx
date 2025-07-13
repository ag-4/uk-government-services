import React, { useState } from 'react';
import { Mail, Calendar, Bell, Shield, Check, AlertCircle, User, MapPin, Phone } from 'lucide-react';
import { subscribeToNewsletter, trackAction } from '../services/database';

interface SubscriptionData {
  name: string;
  email: string;
  address: string;
  phone?: string;
  subscriptionTypes: {
    newsletter: boolean;
    events: boolean;
    alerts: boolean;
  };
  interests: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  dataConsent: boolean;
  marketingConsent: boolean;
}

const SUBSCRIPTION_INTERESTS = [
  'UK Politics',
  'Local Government',
  'Parliamentary Updates',
  'Policy Changes',
  'Voting Information',
  'Citizen Rights',
  'Government Services',
  'Public Consultations',
  'Community Events',
  'Digital Government'
];

export function NewsletterSubscription() {
  const [formData, setFormData] = useState<SubscriptionData>({
    name: '',
    email: '',
    address: '',
    phone: '',
    subscriptionTypes: {
      newsletter: true,
      events: true,
      alerts: false
    },
    interests: [],
    frequency: 'weekly',
    dataConsent: false,
    marketingConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required for location-based updates';
    }

    if (!formData.dataConsent) {
      newErrors.dataConsent = 'You must consent to data processing to subscribe';
    }

    if (!Object.values(formData.subscriptionTypes).some(Boolean)) {
      newErrors.subscriptionTypes = 'Please select at least one subscription type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Use the database service to store subscription
      const subscriptionRecord = await subscribeToNewsletter(formData);
      
      // Track the subscription action
       await trackAction('newsletter_subscription', {
         userId: subscriptionRecord.id,
         subscriptionTypes: formData.subscriptionTypes,
         frequency: formData.frequency,
         interests: formData.interests
       });
      
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (submitStatus === 'success') {
    return (
      <div className="uk-gov-card p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Confirmed!</h2>
          <p className="text-gray-600">
            Thank you, {formData.name}! Your subscription has been successfully set up.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-2 text-left">
            <li>• You'll receive a confirmation email at {formData.email}</li>
            <li>• Your first newsletter will arrive based on your selected frequency</li>
            <li>• Event notifications will be sent for Manchester area events</li>
            <li>• You can update your preferences anytime using the link in our emails</li>
          </ul>
        </div>
        
        <button
          onClick={() => {
            setSubmitStatus('idle');
            setFormData({
              name: 'IBRAHIM ALTAQATQA',
              email: 'owl47d@gmail.com',
              address: 'Manchester, United Kingdom',
              phone: '',
              subscriptionTypes: { newsletter: true, events: true, alerts: false },
              interests: [],
              frequency: 'weekly',
              dataConsent: false,
              marketingConsent: false
            });
          }}
          className="uk-gov-button"
        >
          Subscribe Another Person
        </button>
      </div>
    );
  }

  return (
    <div className="uk-gov-card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Newsletter & Events Subscription</h2>
            <p className="text-gray-600">Stay informed about UK government services and local events</p>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">UK Data Protection Compliance</p>
              <p className="text-amber-700">
                Your data is processed in accordance with UK GDPR and Data Protection Act 2018. 
                We only use your information to provide the services you've requested.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Personal Information
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Address/Location *
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City, Country"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+44 xxx xxx xxxx"
              />
            </div>
          </div>
        </div>

        {/* Subscription Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-600" />
            Subscription Preferences
          </h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.subscriptionTypes.newsletter}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subscriptionTypes: { ...prev.subscriptionTypes, newsletter: e.target.checked }
                }))}
                className="mt-1"
              />
              <div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Newsletter</span>
                </div>
                <p className="text-sm text-gray-600">Regular updates on government services and political news</p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.subscriptionTypes.events}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subscriptionTypes: { ...prev.subscriptionTypes, events: e.target.checked }
                }))}
                className="mt-1"
              />
              <div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-medium">Events</span>
                </div>
                <p className="text-sm text-gray-600">Local government events and public meetings in your area</p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.subscriptionTypes.alerts}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subscriptionTypes: { ...prev.subscriptionTypes, alerts: e.target.checked }
                }))}
                className="mt-1"
              />
              <div>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                  <span className="font-medium">Urgent Alerts</span>
                </div>
                <p className="text-sm text-gray-600">Important government announcements and emergency updates</p>
              </div>
            </label>
          </div>
          
          {errors.subscriptionTypes && (
            <p className="text-red-500 text-sm">{errors.subscriptionTypes}</p>
          )}
        </div>

        {/* Frequency */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Email Frequency</h3>
          <div className="flex space-x-4">
            {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
              <label key={freq} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={formData.frequency === freq}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="text-blue-600"
                />
                <span className="capitalize">{freq}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Areas of Interest (Optional)</h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {SUBSCRIPTION_INTERESTS.map((interest) => (
              <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  className="text-blue-600"
                />
                <span className="text-sm">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Consent */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Data Protection & Consent
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dataConsent}
                onChange={(e) => setFormData(prev => ({ ...prev, dataConsent: e.target.checked }))}
                className="mt-1 text-blue-600"
              />
              <div className="text-sm">
                <span className="font-medium text-red-600">* Required:</span> I consent to the processing of my personal data 
                for the purpose of receiving newsletters and event notifications. I understand my rights under UK GDPR 
                and can withdraw consent at any time. 
                <a href="/privacy-policy.html" className="text-blue-600 hover:underline ml-1" target="_blank">
                  Read our Privacy Policy
                </a>
              </div>
            </label>
            {errors.dataConsent && <p className="text-red-500 text-sm">{errors.dataConsent}</p>}
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                className="mt-1 text-blue-600"
              />
              <div className="text-sm">
                <span className="font-medium">Optional:</span> I consent to receiving marketing communications 
                about related government services and civic engagement opportunities.
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: 'IBRAHIM ALTAQATQA',
                email: 'owl47d@gmail.com',
                address: 'Manchester, United Kingdom',
                phone: '',
                subscriptionTypes: { newsletter: true, events: true, alerts: false },
                interests: [],
                frequency: 'weekly',
                dataConsent: false,
                marketingConsent: false
              });
              setErrors({});
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset Form
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="uk-gov-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe Now
              </>
            )}
          </button>
        </div>
        
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">There was an error processing your subscription. Please try again.</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}