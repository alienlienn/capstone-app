import React from 'react';
import { StyleSheet, View } from 'react-native';
import DashboardForm from "../organisms/DashboardForm";
import { colors } from '../styles/colors';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <DashboardForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_color,
  },
});

export default DashboardScreen;
