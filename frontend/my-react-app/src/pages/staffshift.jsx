import { useState, useEffect } from 'react';
import {
  FaLockOpen,
  FaLock,
  FaMoneyBillWave,
  FaCalculator,
  FaHistory,
  FaPrint,
  FaClock,
  FaUser,
  FaCashRegister,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign,
  FaCalendarAlt,
  FaExchangeAlt,
  FaDatabase,
  FaChartLine,
  FaReceipt,
  FaWallet,
  FaCoins,
  FaBriefcase
} from 'react-icons/fa';

const SimpleShiftManagement = () => {
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [openAmount, setOpenAmount] = useState('');
  const [closeAmount, setCloseAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedShift = localStorage.getItem('currentShift');
    const savedHistory = localStorage.getItem('shiftHistory');
    
    if (savedShift) setCurrentShift(JSON.parse(savedShift));
    if (savedHistory) setShiftHistory(JSON.parse(savedHistory));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (currentShift) {
      localStorage.setItem('currentShift', JSON.stringify(currentShift));
    }
  }, [currentShift]);

  useEffect(() => {
    localStorage.setItem('shiftHistory', JSON.stringify(shiftHistory));
  }, [shiftHistory]);

  // Open new shift
  const handleOpenShift = () => {
    if (!openAmount || parseFloat(openAmount) <= 0) {
      alert('Please enter valid opening amount');
      return;
    }

    const newShift = {
      id: Date.now(),
      staffName: 'Staff Member',
      openTime: new Date().toLocaleTimeString(),
      openDate: new Date().toLocaleDateString(),
      openingCash: parseFloat(openAmount),
      closingCash: null,
      closeTime: null,
      difference: null,
      notes: notes,
      status: 'active',
      timestamp: new Date().toISOString()
    };

    setCurrentShift(newShift);
    setOpenAmount('');
    setNotes('');
    
    // Add notification sound or vibration in real app
    alert(`✅ Shift opened with ₹${openAmount} starting cash`);
  };

  // Close current shift
  const handleCloseShift = () => {
    if (!closeAmount || parseFloat(closeAmount) < 0) {
      alert('Please enter valid closing amount');
      return;
    }

    const closingCash = parseFloat(closeAmount);
    const difference = closingCash - currentShift.openingCash;

    const closedShift = {
      ...currentShift,
      closingCash: closingCash,
      closeTime: new Date().toLocaleTimeString(),
      difference: difference,
      status: 'closed',
      closeTimestamp: new Date().toISOString()
    };

    // Add to history
    setShiftHistory([closedShift, ...shiftHistory]);
    
    // Reset current shift
    setCurrentShift(null);
    setCloseAmount('');
    
    // Show summary
    const message = difference >= 0 
      ? `✅ Shift closed! Profit: ₹${difference.toFixed(2)}`
      : `⚠️ Shift closed! Shortage: ₹${Math.abs(difference).toFixed(2)}`;
    
    alert(message);
  };

  // Calculate expected cash
  const calculateExpectedCash = () => {
    if (!closeAmount) return 0;
    const diff = parseFloat(closeAmount) - (currentShift?.openingCash || 0);
    return diff;
  };

  // Print receipt
  const printReceipt = (shift) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Shift Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin: 15px 0; }
            .amount { font-size: 18px; font-weight: bold; }
            .positive { color: green; }
            .negative { color: red; }
            hr { border: 1px solid #ccc; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>SHIFT REPORT</h2>
            <p>${shift.openDate} • ${shift.openTime} - ${shift.closeTime}</p>
          </div>
          <hr>
          <div class="details">
            <p><strong>Staff:</strong> ${shift.staffName}</p>
            <p><strong>Opening Cash:</strong> ₹${shift.openingCash.toFixed(2)}</p>
            <p><strong>Closing Cash:</strong> ₹${shift.closingCash.toFixed(2)}</p>
            <p><strong>Difference:</strong> 
              <span class="amount ${shift.difference >= 0 ? 'positive' : 'negative'}">
                ${shift.difference >= 0 ? '+' : ''}₹${shift.difference.toFixed(2)}
              </span>
            </p>
            <p><strong>Status:</strong> ${shift.difference >= 0 ? '✅ Correct' : '⚠️ Short'}</p>
            ${shift.notes ? `<p><strong>Notes:</strong> ${shift.notes}</p>` : ''}
          </div>
          <hr>
          <p style="text-align: center; color: #666;">
            Generated on ${new Date().toLocaleString()}
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Clear all history
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all shift history?')) {
      setShiftHistory([]);
      localStorage.removeItem('shiftHistory');
    }
  };

  // Calculate totals
  const getTotals = () => {
    const todayShifts = shiftHistory.filter(s => 
      s.openDate === new Date().toLocaleDateString()
    );
    
    return {
      totalShifts: shiftHistory.length,
      todayShifts: todayShifts.length,
      totalOpening: shiftHistory.reduce((sum, s) => sum + s.openingCash, 0),
      totalDifference: shiftHistory.reduce((sum, s) => sum + (s.difference || 0), 0),
      avgDifference: shiftHistory.length > 0 
        ? shiftHistory.reduce((sum, s) => sum + (s.difference || 0), 0) / shiftHistory.length 
        : 0
    };
  };

  const totals = getTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <FaCashRegister className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Shift Cash Management
              </h1>
              <p className="text-gray-400">Open and close shifts with cash tracking</p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400">Today's Shifts</div>
              <div className="text-lg font-bold">{totals.todayShifts}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400">Total Shifts</div>
              <div className="text-lg font-bold">{totals.totalShifts}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400">Net Difference</div>
              <div className={`text-lg font-bold ${
                totals.totalDifference >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{totals.totalDifference.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400">Avg per Shift</div>
              <div className={`text-lg font-bold ${
                totals.avgDifference >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{totals.avgDifference.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Shift */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Shift Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    currentShift 
                      ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30' 
                      : 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30'
                  }`}>
                    {currentShift ? <FaLockOpen className="text-green-400" /> : <FaLock className="text-red-400" />}
                  </div>
                  <span>Current Shift Status</span>
                </h2>
                <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                  currentShift 
                    ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-300 border border-green-700/50' 
                    : 'bg-gradient-to-r from-red-900/30 to-orange-900/30 text-red-300 border border-red-700/50'
                }`}>
                  {currentShift ? (
                    <>
                      <FaClock className="animate-pulse" />
                      <span>ACTIVE</span>
                    </>
                  ) : (
                    <>
                      <FaLock />
                      <span>CLOSED</span>
                    </>
                  )}
                </div>
              </div>

              {currentShift ? (
                <div className="space-y-6">
                  {/* Shift Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-4 rounded-xl border border-blue-700/30">
                      <div className="text-sm text-blue-300 mb-1 flex items-center gap-2">
                        <FaWallet /> Opening Cash
                      </div>
                      <div className="text-3xl font-bold text-blue-300">
                        ₹{currentShift.openingCash.toFixed(2)}
                      </div>
                      <div className="text-xs text-blue-400/70 mt-2">
                        {currentShift.openDate} • {currentShift.openTime}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-4 rounded-xl border border-purple-700/30">
                      <div className="text-sm text-purple-300 mb-1 flex items-center gap-2">
                        <FaClock /> Duration
                      </div>
                      <div className="text-3xl font-bold text-purple-300">
                        Active
                      </div>
                      <div className="text-xs text-purple-400/70 mt-2">
                        Started: {currentShift.openTime}
                      </div>
                    </div>
                  </div>

                  {/* Close Shift Form */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg border border-red-500/30">
                        <FaLock className="text-red-400" />
                      </div>
                      <span>Close Shift</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Actual Cash in Drawer
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <FaRupeeSign />
                          </span>
                          <input
                            type="number"
                            placeholder="Enter total cash amount"
                            value={closeAmount}
                            onChange={(e) => setCloseAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg backdrop-blur-sm"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Count all physical cash in the drawer
                        </p>
                      </div>

                      {/* Difference Preview */}
                      <div className={`p-4 rounded-xl border ${
                        calculateExpectedCash() >= 0 
                          ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/30' 
                          : 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700/30'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-300">Expected Difference</div>
                            <div className={`text-2xl font-bold ${
                              calculateExpectedCash() >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {calculateExpectedCash() >= 0 ? '+' : ''}₹{calculateExpectedCash().toFixed(2)}
                            </div>
                          </div>
                          <FaCalculator className="text-2xl text-gray-400" />
                        </div>
                      </div>

                      <button
                        onClick={handleCloseShift}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-red-500/25"
                      >
                        <FaLock /> Close Shift & Calculate Difference
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Open Shift Form */
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                      <FaLockOpen className="text-green-400" />
                    </div>
                    <span>Open New Shift</span>
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Starting Cash Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <FaRupeeSign />
                      </span>
                      <input
                        type="number"
                        placeholder="Enter opening cash amount"
                        value={openAmount}
                        onChange={(e) => setOpenAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg backdrop-blur-sm"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the cash amount you're starting with in the drawer
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      placeholder="Any notes for this shift..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm"
                      rows="3"
                    />
                  </div>

                  <button
                    onClick={handleOpenShift}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-green-500/25"
                  >
                    <FaLockOpen /> Open New Shift
                  </button>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                  <FaExchangeAlt className="text-purple-400" />
                </div>
                <span>How It Works</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-medium">Open Shift</h4>
                      <p className="text-sm text-gray-400">Enter starting cash amount</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-medium">Close Shift</h4>
                      <p className="text-sm text-gray-400">Enter actual cash amount</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-medium">Work Shift</h4>
                      <p className="text-sm text-gray-400">Handle transactions during shift</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-medium">Get Difference</h4>
                      <p className="text-sm text-gray-400">System calculates profit/loss</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - History & Actions */}
          <div className="space-y-6">
            {/* History Toggle */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    showHistory 
                      ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 border border-blue-700/30' 
                      : 'bg-gray-900/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <FaHistory /> {showHistory ? 'Hide History' : 'View History'}
                </button>
                <button
                  onClick={clearHistory}
                  className="ml-2 px-3 py-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 text-red-300 rounded-lg border border-red-700/30 hover:bg-red-700/30"
                  title="Clear all history"
                >
                  <FaTimesCircle />
                </button>
              </div>
            </div>

            {/* History/Stats Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
                  <FaDatabase className="text-blue-400" />
                </div>
                <span>{showHistory ? 'Shift History' : 'Today\'s Summary'}</span>
              </h3>
              
              {showHistory ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {shiftHistory.map((shift) => (
                    <div key={shift.id} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium">{shift.staffName}</div>
                          <div className="text-xs text-gray-400">
                            {shift.openDate} • {shift.openTime} - {shift.closeTime || 'Active'}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          shift.status === 'closed'
                            ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-300 border border-green-700/50'
                            : 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 text-blue-300 border border-blue-700/50'
                        }`}>
                          {shift.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                          <div className="text-gray-400">Opening</div>
                          <div className="font-bold text-blue-300">₹{shift.openingCash.toFixed(2)}</div>
                        </div>
                        {shift.closingCash !== null && (
                          <>
                            <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                              <div className="text-gray-400">Closing</div>
                              <div className="font-bold text-purple-300">₹{shift.closingCash.toFixed(2)}</div>
                            </div>
                            <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                              <div className="text-gray-400">Difference</div>
                              <div className={`font-bold ${
                                shift.difference >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {shift.difference >= 0 ? '+' : ''}₹{shift.difference.toFixed(2)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {shift.closingCash !== null && (
                        <button
                          onClick={() => printReceipt(shift)}
                          className="w-full mt-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                          <FaPrint /> Print Receipt
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {shiftHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaHistory className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No shift history yet</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {shiftHistory.slice(0, 3).map((shift) => (
                      <div key={shift.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{shift.openTime}</div>
                            <div className="text-xs text-gray-400">{shift.openDate}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              shift.difference >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {shift.difference >= 0 ? '+' : ''}₹{shift.difference?.toFixed(2) || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {shift.status === 'closed' ? 'Closed' : 'Active'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {shiftHistory.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <p>No recent shifts</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-900/50 rounded">
                        <div className="text-xs text-gray-400">Total Opening</div>
                        <div className="font-bold">₹{totals.totalOpening.toFixed(2)}</div>
                      </div>
                      <div className="p-2 bg-gray-900/50 rounded">
                        <div className="text-xs text-gray-400">Net Total</div>
                        <div className={`font-bold ${
                          totals.totalDifference >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ₹{totals.totalDifference.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-700/30">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const amount = prompt('Enter cash to add to current shift:');
                    if (amount && !isNaN(amount)) {
                      alert(`₹${amount} added to records`);
                    }
                  }}
                  className="w-full py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCoins /> Record Cash In
                </button>
                
                <button
                  onClick={() => {
                    const amount = prompt('Enter expense amount:');
                    if (amount && !isNaN(amount)) {
                      alert(`₹${amount} expense recorded`);
                    }
                  }}
                  className="w-full py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FaBriefcase /> Record Expense
                </button>
                
                <button
                  onClick={() => {
                    if (shiftHistory.length > 0) {
                      const total = shiftHistory.reduce((sum, s) => sum + (s.difference || 0), 0);
                      alert(`Total net difference: ₹${total.toFixed(2)}`);
                    } else {
                      alert('No shift history available');
                    }
                  }}
                  className="w-full py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FaChartLine /> Calculate Total
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-700/30">
                  <FaInfoCircle className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    All data is saved automatically. Shift history persists across browser sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p className="mb-2">Simple Shift Management System • Dark Theme</p>
          <p className="text-xs text-gray-600">Automatically saves to browser storage • Print receipts • Track cash flow</p>
        </div>
      </div>
    </div>
  );
};

// Add missing icon component
const FaInfoCircle = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

export default SimpleShiftManagement;