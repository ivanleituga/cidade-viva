// src/navigation/AppNavigator.js
// Estrutura de navegação combinando Bottom Tabs (raiz) com Stacks por aba.
// - Aba "Início": dashboard
// - Aba "Registros": lista -> detalhe -> form (criar/editar)
// - Aba "Estatísticas": gráficos/contagens
//
// Atende ao requisito: "Uso de React Navigation (Stack, Tab ou Drawer)"

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ReportListScreen from '../screens/ReportListScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';
import ReportFormScreen from '../screens/ReportFormScreen';
import StatsScreen from '../screens/StatsScreen';

import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ReportsStack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: colors.background },
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Cidade Viva' }}
      />
      <HomeStack.Screen
        name="ReportForm"
        component={ReportFormScreen}
        options={({ route }) => ({
          title: route.params?.reportId ? 'Editar registro' : 'Novo registro',
        })}
      />
      <HomeStack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: 'Detalhes' }}
      />
    </HomeStack.Navigator>
  );
}

function ReportsStackNavigator() {
  return (
    <ReportsStack.Navigator screenOptions={screenOptions}>
      <ReportsStack.Screen
        name="ReportList"
        component={ReportListScreen}
        options={{ title: 'Registros' }}
      />
      <ReportsStack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: 'Detalhes' }}
      />
      <ReportsStack.Screen
        name="ReportForm"
        component={ReportFormScreen}
        options={({ route }) => ({
          title: route.params?.reportId ? 'Editar registro' : 'Novo registro',
        })}
      />
    </ReportsStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'HomeTab') iconName = 'home';
            else if (route.name === 'ReportsTab') iconName = 'list';
            else if (route.name === 'StatsTab') iconName = 'stats-chart';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{ tabBarLabel: 'Início' }}
        />
        <Tab.Screen
          name="ReportsTab"
          component={ReportsStackNavigator}
          options={{ tabBarLabel: 'Registros' }}
        />
        <Tab.Screen
          name="StatsTab"
          component={StatsScreen}
          options={{
            tabBarLabel: 'Estatísticas',
            headerShown: true,
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: '700' },
            title: 'Estatísticas',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
