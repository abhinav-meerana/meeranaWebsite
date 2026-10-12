import React from 'react';
import { v4 as uuid } from 'uuid';

const flaskServerUrl = process.env.REACT_APP_CHATBOT_URL || 'http://20.46.197.154:7000/chatbot';
const session_id = uuid();

// Knowledge base for fallback bot responses when the remote server is offline
const getFallbackAnswer = (question) => {
  const q = question.toLowerCase();

  if (q.includes('mandobee') || q.includes('mandoobee') || q.includes('mandobe') || q.includes('mandoobe')) {
    return "Mandoobee brings HR, projects, documents, communication and AI together in one unified platform to help your organization move faster, smarter and better. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('tasree3') || q.includes('tasree') || q.includes('tasre3')) {
    return "Tasree3 is an AI-assisted process mining and process engineering platform that helps organizations design, analyze, optimize, and improve business processes through intelligent workflow discovery, visual modeling, performance insights, and AI-powered recommendations. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('asset') || q.includes('tracking')) {
    return "Our Asset Tracking system leverages IoT, RFID, and Bluetooth BLE technology for real-time location tracking, inventory management, and equipment security. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('nazoo') || q.includes('nazo') || q.includes('naazoo') || q.includes('correspondence')) {
    return "Nazoo empowers organizations to initiate, manage, track, approve, sign, and archive internal and external communications through a secure digital platform. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('wasel') || q.includes('wasal') || q.includes('wassel')) {
    return "WASEL is an IoT door and gate management solution that modernizes access control through multi-mode connectivity, real-time monitoring, and secure role-based access for residential communities, villas, apartments, and commercial facilities. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('yisbir') || q.includes('yisbeer') || q.includes('yasbir') || q.includes('yisbr')) {
    return "Yisbir is an AI-powered talent acquisition and smart recruitment matching platform designed to streamline enterprise hiring. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('zing') || q.includes('hr')) {
    return "We provide Zing HR integration for comprehensive human capital management, payroll automation, leave tracking, and employee self-service. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('data management')) {
    return "Consultation services for data management offer expert guidance and strategies to optimize an organization's data handling practices. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('data center')) {
    return "Consultation services for data centers offer expertise in designing, optimizing, and managing data center infrastructure. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('customer experience') || q.includes('happiness')) {
    return "Consultation services for customer experience and happiness focus on enhancing interactions and satisfaction. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('digital transformation')) {
    return "Digital transformation is the strategic adoption of technology to revolutionize business processes and enhance customer experiences in an increasingly digital world. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('enterprise it') || q.includes('architecture')) {
    return "Consultation services for enterprise IT architecture offer expertise in designing, optimizing, and managing IT infrastructure. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('erp')) {
    return "An ERP system integrating core business processes, data, and operations into a unified platform for enhanced efficiency, productivity, and decision-making. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('software development') || q.includes('software')) {
    return "Software development is the art of transforming ideas into functional and innovative computer programs across web, mobile, and desktop. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('cloud')) {
    return "Cloud services provide on-demand access to scalable and virtualized computing resources, enabling efficient storage, processing, and delivery of data over the internet. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('rpa') || q.includes('robotic process')) {
    return "Robotic Process Automation (RPA) automates repetitive tasks and processes using software robots, enhancing productivity and accuracy. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('ecommerce') || q.includes('e-commerce')) {
    return "E-commerce platforms facilitating online buying and selling of products or services, providing a convenient and accessible marketplace. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('blockchain') || q.includes('metaverse') || q.includes('ai')) {
    return "Blockchain, Metaverse, and AI solutions enable secure, verifiable digital transactions and intelligent automated applications. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('cyber') || q.includes('security')) {
    return "Cybersecurity measures safeguarding digital systems, networks, and data from unauthorized access, threats, and breaches. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('iot')) {
    return "Bespoke products and services in IoT hardware and software refer to tailored solutions designed to meet specific needs in the Internet of Things ecosystem. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('voc') || q.includes('gen ai')) {
    return "Voice of Customer (VOC) Solution using Generative AI provides live integration, sentiment analysis, feedback monitoring, and actionable suggestions. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('smart office')) {
    return "A smart office application enabling seamless collaboration, smart scheduling, GPS clock in/out, and efficient task management. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('legal')) {
    return "A legal management application streamlining legal workflows, document management, litigation case tracking, and contract management. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('real estate')) {
    return "A real estate application empowering users to seamlessly search, buy, sell, and manage properties with comprehensive listings and personalized features. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('ev charger') || q.includes('green hub')) {
    return "Eco-friendly charging solutions for electric vehicles and sustainable green hubs fostering environmental innovation. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('warehouse')) {
    return "Warehouse management system optimizing inventory control, logistics, and inbound/outbound operations for streamlined storage. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('staff augmentation')) {
    return "Supercharge your IT team with expert staff augmentation, accessing top tech professionals tailored to your unique project needs. For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!";
  }
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
    return "You can reach our dedicated team directly at info@meerana.ae or fill out our Contact Us form below. We will get back to you promptly!";
  }
  if (q.includes('career') || q.includes('job') || q.includes('hiring') || q.includes('vacancy')) {
    return "We are always looking for passionate talent to join our team! Please check our Careers section on the website or reach us at info@meerana.ae.";
  }
  if (q.includes('location') || q.includes('office') || q.includes('address') || q.includes('dubai') || q.includes('uae')) {
    return "Meerana Technologies is located in Dubai, United Arab Emirates. Feel free to contact us at info@meerana.ae for office inquiries or meetings.";
  }
  if (q.includes('product') || q.includes('service') || q.includes('offer')) {
    return "Meerana Technologies offers a suite of enterprise solutions including Mandoobee (PRO Automation), Tasree3 (Digital Transformation), NAZO (Document Management), Wasel (Logistics), Yisbir (AI HR), Zing HR, ERP, IoT Asset Tracking, and Cloud Services. For more info on any product, feel free to contact us at info@meerana.ae or submit our Contact Us form below!";
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings')) {
    return "Hello! How can I assist you with Meerana products or services today?";
  }

  return "Thank you for reaching out! For detailed inquiries about our products and services, please contact us at info@meerana.ae or fill out our Contact Us form below.";
};

async function askQuestion(question) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const req_message = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: session_id, question: question }),
      signal: controller.signal
    };

    const response = await fetch(flaskServerUrl, req_message);
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    if (responseData && responseData.response) {
      return responseData.response;
    }
    return getFallbackAnswer(question);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Bot server unreachable, using fallback answer:', error);
    return getFallbackAnswer(question);
  }
}

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleMessage = (message) => {
    askQuestion(message)
      .then(answer => {
        const botMessage = createChatBotMessage(answer);

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      })
      .catch(error => {
        console.error('Error:', error);
        const botMessage = createChatBotMessage(getFallbackAnswer(message));
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      });
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleMessage
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
