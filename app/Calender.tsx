import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

// Type for post data
interface Post {
  date: string;
  thumbnail: string;
}

const posts: Post[] = [
  { date: '2024-11-01', thumbnail: 'https://image.shutterstock.com/image-vector/red-banner-example-on-white-260nw-2389398615.jpg' },
  { date: '2024-11-05', thumbnail: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg' },
  { date: '2024-11-10', thumbnail: 'https://i.redd.it/i-went-to-six-flags-over-texas-the-day-before-the-eclipse-v0-z7vm0falhauc1.jpg?width=4160&format=pjpg&auto=webp&s=e9cad431639915003f8a5fb93f88165e59660a39' },
];

interface Day {
  date: string;
  hasPost: boolean;
}

const Calendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('days');
  const [days, setDays] = useState<Day[]>([]);
  const [monthName, setMonthName] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    setMonthName(monthNames[currentMonth]);

    const generatedDays: Day[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      generatedDays.push({ date: '', hasPost: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      generatedDays.push({
        date: formattedDate,
        hasPost: posts.some(post => post.date === formattedDate),
      });
    }

    setDays(generatedDays);
  }, [currentMonth, currentYear]);

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Group days into weeks
  const groupDaysIntoWeeks = (days: Day[]) => {
    const weeks: Day[][] = [];
    let currentWeek: Day[] = [];

    days.forEach(day => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length) weeks.push(currentWeek);

    return weeks;
  };

  const renderDay = ({ item }: { item: Day }) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const isCurrentDay = item.date === currentDate; // Check if the item is the current day
    
    return (
      <View
        style={[
          styles.dayContainer,
          !item.date && styles.emptyDay,
          isCurrentDay && styles.currentDayHighlight, // Apply current day highlight style
        ]}
      >
        {item.date && (
          <>
            {item.hasPost ? (
              <Image
                source={{
                  uri: posts.find(post => post.date === item.date)?.thumbnail,
                }}
                style={styles.thumbnail}
              />
            ) : (
              <Image
                source={{
                  uri: 'https://user-images.githubusercontent.com/2279051/36819127-dc9e33ea-1c9c-11e8-9a93-0d3c0a674f02.png',
                }}
                style={styles.thumbnail}
              />
            )}
            <Text style={styles.dayText}>{parseInt(item.date.split('-')[2], 10)}</Text>
          </>
        )}
      </View>
    );
  };
  

  const renderMonth = () => (
    <View style={styles.monthContainer}>
      <Image source={{ uri: "https://user-images.githubusercontent.com/2279051/36819127-dc9e33ea-1c9c-11e8-9a93-0d3c0a674f02.png" }} style={styles.monthThumbnail} />
      <Text style={styles.monthText}>{monthName}</Text>
    </View>
  );

  const renderWeek = ({ item }: { item: Day[] }) => {
    const startDate = item[0].date.split('-')[2];
    const endDate = item[item.length - 1].date.split('-')[2];
    
    return (
      <View style={[styles.weekContainer, { width: '100%' }]}>
        <Image source={{ uri: "https://user-images.githubusercontent.com/2279051/36819127-dc9e33ea-1c9c-11e8-9a93-0d3c0a674f02.png" }} style={styles.weekImage} />
        <Text style={styles.weekText}>{`${startDate} - ${endDate}`}</Text>
      </View>
    );
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'days':
        return (
          <View>
            {/* Render the weekdays header */}
            <View style={styles.weekdayHeader}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <Text key={index} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>
            {/* Render the days */}
            <FlatList
              data={days}
              numColumns={7} // 7 columns for days of the week
              keyExtractor={(item, index) => `${index}`}
              renderItem={renderDay}
              key={`${viewMode}-${currentMonth}`} // Use viewMode and currentMonth as key to force re-render
            />
          </View>
        );
      case 'weeks':
        const weeks = groupDaysIntoWeeks(days);
        return (
          <FlatList
            data={weeks}
            keyExtractor={(item, index) => `week-${index}`}
            renderItem={renderWeek}
            key={`${viewMode}-${currentMonth}`} // Use viewMode and currentMonth as key to force re-render
            contentContainerStyle={styles.weeksListContainer} // Center the FlatList content
          />
        );
      case 'months':
        return renderMonth();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthHeader}>{monthName} {currentYear}</Text>
        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setViewMode('days')}>
          <Text style={[styles.toggleText, viewMode === 'days' && styles.activeToggle]}>Days</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('weeks')}>
          <Text style={[styles.toggleText, viewMode === 'weeks' && styles.activeToggle]}>Weeks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('months')}>
          <Text style={[styles.toggleText, viewMode === 'months' && styles.activeToggle]}>Months</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerWrapper}> {/* New wrapper to center the content */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      flexDirection: 'column', 
    },
    header: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      padding: 10, 
      backgroundColor: '#fff', 
      elevation: 3, 
    },
    monthHeader: { fontSize: 20,justifyContent: 'center', flex: 1, textAlign: 'center', alignItems: 'center'},
    arrowText: { 
      fontSize: 30, // Increased font size for better visibility 
      color: '#fff', // White text color for the arrow 
    },
    arrowButton: { 
      backgroundColor: '#4A90E2', // Stylish background color for the button
      borderRadius: 50, // Makes the button circular
      width: 50, // Larger width for easier touch
      height: 50, // Larger height for easier touch
      justifyContent: 'center', 
      alignItems: 'center', 
      elevation: 5, // Adds depth to the button with shadow
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 5, 
    },
    weekdayHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      backgroundColor: '#f1f1f1', 
      paddingVertical: 5, 
    },
    currentDay: {
        borderColor: '#ADD8E6', // Highlight border color (you can adjust the color)
        borderWidth: 0, // Border width to make the highlight visible
        backgroundColor: '#ADD8E6', // Optional background color for the current day
      },
      dayContainer: {
        width: '13.2%',
        margin: 2,
        height: 95,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      currentDayHighlight: {
        backgroundColor: '#FFFFA1', // Light blue background for the current day
        borderRadius: 0, // Rounded corners for the highlight
        borderColor: '#FFFFA1', // A darker blue for the border
        borderWidth: 1, // Thickness of the border
        padding: 0, // Add some space around the content
      },
    weekdayText: { 
      fontSize: 16, 
      fontWeight: 'bold', 
      textAlign: 'center', 
      width: '13.2%',  
    },
    dayContainer: { 
      width: '13.2%',
      margin: 2, 
      height: 95, 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: '#ccc', 
      backgroundColor: '#ffffff',
      flexDirection: 'column', 
      justifyContent: 'flex-end', 
      elevation: 3, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.2, 
      shadowRadius: 4, 
    },
    dayText: { 
      fontSize: 16,
      paddingBottom: 5, 
      marginTop: 5,
    },
    thumbnail: { 
      width: '87%', 
      height: 60, 
    },
    weekContainer: {  
      margin: 10, 
      height: 400,
      width:  600,  
      flexDirection: 'column', 
      borderWidth: 1, 
      borderColor: '#ccc', 
      backgroundColor: '#ffffff', 
      marginBottom: 10,
      elevation: 4, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 5, 
    },
    weekText: { 
      fontSize: 18, 
      textAlign: 'center', 
      paddingBottom: 10,
      marginTop: 20 
    },
    weeksListContainer: {
      alignItems: 'center', 
      justifyContent: 'center',
    },
    monthContainer: { 
      justifyContent: 'center',  
      alignItems: 'center',  
      margin: 10, 
      width: '90%',  
      flexDirection: 'column',  
      borderWidth: 1, 
      borderColor: '#ccc', 
      backgroundColor: '#ffffff', 
      marginBottom: 10,
      elevation: 5, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 6 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 6, 
    },
    monthThumbnail: { 
      width: '90%', 
      height: 450, margin: 20, marginBottom:50,
    },
    monthText: { 
      fontSize: 24, 
      marginBottom: 40 
    },
    toggleContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      marginVertical: 30 
    },
    toggleText: { 
      fontSize: 16 
    },
    activeToggle: { 
      fontWeight: 'bold', 
      textDecorationLine: 'underline' 
    },
    weekImage: { 
      width: 200, 
      height: 300, 
      margin: 10 
    },
    centerWrapper: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
  });
  
  
  

export default Calendar;
