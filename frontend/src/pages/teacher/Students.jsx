import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, TrendingDown, User } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { performanceAPI } from '../../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStd, setSelectedStd] = useState('all');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedStd, students]);

  const fetchStudents = async () => {
    try {
      const response = await performanceAPI.getAllStudents();
      const serverStudents = (response.data.students || []).map((student) => {
        const average = student.average_percentage ? Number(student.average_percentage) : 0;
        const safeName = student.username || 'Unknown Student';
        return {
          id: student.id,
          name: safeName,
          std: student.std,
          avgScore: Number(average.toFixed(2)),
          testsCompleted: student.total_tests ? Number(student.total_tests) : 0,
          contact: student.mobile || '',
          trend: average >= 75 ? 'up' : 'down',
          lastTestDate: student.last_test_date
        };
      });

      setStudents(serverStudents);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setFetchError('Unable to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStd !== 'all') {
      filtered = filtered.filter(student => student.std === parseInt(selectedStd));
    }

    setFilteredStudents(filtered);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
        <p className="text-gray-600">View and manage student profiles and performance</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={selectedStd}
              onChange={(e) => setSelectedStd(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Standards</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(std => (
                <option key={std} value={std}>Standard {std}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Total Students</p>
            <p className="text-4xl font-bold text-gray-900">{students.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Class Average</p>
            <p className="text-4xl font-bold text-green-600">
              {students.length > 0
                ? Math.round(
                    students.reduce((sum, s) => sum + (s.avgScore || 0), 0) / students.length
                  )
                : 0}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Active Students</p>
            <p className="text-4xl font-bold text-blue-600">
              {students.filter(s => s.testsCompleted > 0).length}
            </p>
          </div>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        {fetchError && (
          <p className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md mb-4">
            {fetchError}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Standard</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Avg. Score</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Tests Completed</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                          {student.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.contact || 'No contact info'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Std {student.std}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        student.avgScore >= 80 ? 'text-green-600' : 
                        student.avgScore >= 60 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {student.avgScore || 0}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{student.testsCompleted || 0}</td>
                    <td className="py-3 px-4">
                      {student.trend === 'up' ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp size={16} />
                          <span className="text-sm font-medium">Improving</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown size={16} />
                          <span className="text-sm font-medium">Needs Help</span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Students;
