import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function DateTimeWidget() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-blue-600" />
        <div>
          <p className="text-xs font-bold text-slate-950">{formatDay(dateTime)}</p>
          <p className="text-xs text-slate-500">{formatDate(dateTime)}</p>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <Clock className="h-4 w-4 text-blue-600" />
        <p className="text-xs font-bold text-slate-950">{formatTime(dateTime)}</p>
      </div>
    </div>
  );
}
