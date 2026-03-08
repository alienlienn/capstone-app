import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../styles/colors';

const DashboardScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background_color }}>
      <Text>Dashboard</Text>
    </View>
  );
};

export default DashboardScreen;
