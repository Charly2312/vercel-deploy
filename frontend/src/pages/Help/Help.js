import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './Help.css';

const Help = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (faq) => {
    setActiveFAQ(activeFAQ === faq ? null : faq);
  };

  const faqs = [
    {
      id: 'accountManagement',
      title: 'Account Management',
      content: [
        { question: 'How do I create an account?', answer: 'To create an account, click on the "Sign Up" button on the login page and fill in the required information.' },
        { question: 'How do I reset my password?', answer: 'Click on the "Forgot Password" link on the login page and follow the instructions to reset your password.' },
        { question: 'How do I update my profile information?', answer: 'Go to "Account Settings" and update your profile information as needed.' },
      ],
    },
    {
      id: 'usingApp',
      title: 'Using the App',
      content: [
        { question: 'How do I add tasks to my to-do list?', answer: 'Navigate to the "To-Do List" section and click on the specific date to add a new task.' },
        { question: 'How do I view my upcoming events?', answer: 'Go to the "Calendar" section to see all your scheduled events.' },
        { question: 'How do I mark tasks as completed?', answer: 'In the "To-Do List" section, click on the checkbox next to the task to mark it as completed.' },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      content: [
        { question: 'How do notifications work?', answer: 'Notifications alert you to upcoming events and tasks. They appear as pop-ups and in the "Notifications" section.' },
        { question: 'How can I manage notification settings?', answer: 'Go to "Settings" and adjust your notification preferences to suit your needs.' },
      ],
    },
  ];

  return (
    <div className="help-page">
      <Sidebar />
      <div className="help-content">
        <h1>Help Center</h1>
        <section className="introduction-section">
          <p>Welcome to the OnTrack Help Center. Here you can find answers to common questions, user guides, and support resources to help you make the most out of OnTrack.</p>
        </section>

        <section className="faq-section">
          <h2>FAQs</h2>
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-category">
              <h3 onClick={() => toggleFAQ(faq.id)}>
                {faq.title}
                <span className="toggle-icon">{activeFAQ === faq.id ? '▲' : '▼'}</span>
              </h3>
              {activeFAQ === faq.id && (
                <div className="faq-content">
                  {faq.content.map((item, index) => (
                    <div key={index} className="faq-item">
                      <h4>{item.question}</h4>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="help-section">
          <h2>Contact Support</h2>
          <div className="help-section-content">
            <p>If you need further assistance, please contact our support team:</p>
            <p>Email: support@ontrack.com</p>
          </div>
        </section>

        <section className="help-section">
          <h2>Feedback</h2>
          <div className="help-section-content">
            <p>We value your feedback! Please use the form below to send us your comments and suggestions:</p>
            <form>
              <label>
                Your Feedback:
                <textarea name="feedback" rows="4" cols="50"></textarea>
              </label>
              <br />
              <button type="submit">Submit Feedback</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;
