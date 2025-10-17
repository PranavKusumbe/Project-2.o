import React from 'react';
import Card from '../../components/Card';

const CommunityRemoved = () => (
  <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
    <Card>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
      <p className="text-gray-600">The Community feature has been removed.</p>
    </Card>
  </div>
);

export default CommunityRemoved;
  const [newPost, setNewPost] = useState('');
