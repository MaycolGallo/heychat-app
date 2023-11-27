function getTimePassed(timestamp: number): string {
    const currentTime: number = Date.now();
    const timeDifference: number = currentTime - timestamp;
  
    const intervals: { label: string, seconds: number }[] = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];
  
    for (let i = 0; i < intervals.length; i++) {
      const { label, seconds } = intervals[i];
      const count: number = Math.floor(timeDifference / seconds);
  
      if (count > 0) {
        return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
      }
    }
  
    return 'Just now';
  }
  
  const timestamp: number = 1628764800000; // Example timestamp in milliseconds
  const timePassed: string = getTimePassed(timestamp);
  console.log(timePassed);