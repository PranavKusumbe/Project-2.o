import React from 'react';
import Card from '../../components/Card';

const RemovedChat = () => (
  <div className="space-y-6 animate-fade-in">
    <Card>
      <h2 className="text-xl font-bold">Chat feature has been removed.</h2>
      <p className="text-gray-600">Please use other available features from the sidebar.</p>
    </Card>
  </div>
);

export default RemovedChat;
