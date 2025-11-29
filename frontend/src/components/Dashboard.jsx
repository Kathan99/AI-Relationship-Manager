import React from 'react';
import { Shield, TrendingUp, PieChart as PieIcon, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = ({ data }) => {
    if (!data) return <div className="loading" style={{ color: 'white', padding: '20px' }}>Loading Profile...</div>;

    const { user, portfolio } = data;

    const chartData = portfolio.holdings.map(item => ({
        name: item.product_name,
        value: item.current_value
    }));

    return (
        <div className="dashboard-panel">
            <h2>Welcome, {user.name.split(' ')[0]}</h2>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Shield size={20} color="#6366f1" />
                    <h3>Risk Profile</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="highlight">{user.risk_level}</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {user.segments.join(" • ")}
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Wallet size={20} color="#10b981" />
                    <h3>Total Portfolio</h3>
                </div>
                <p className="amount">₹{(portfolio.current_value / 100000).toFixed(2)}L</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <span>Invested</span>
                    <span>₹{(portfolio.total_invested / 100000).toFixed(2)}L</span>
                </div>
            </div>

            <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <PieIcon size={20} color="#f59e0b" />
                    <h3>Top Holdings</h3>
                </div>
                <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={50}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ fontSize: '0.7rem', color: '#cbd5e1' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;