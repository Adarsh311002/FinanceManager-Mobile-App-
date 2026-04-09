import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { lightTheme, darkTheme } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F43F5E',
  Transport: '#3B82F6',
  Salary: '#57C9A4',
  Entertainment: '#8B5CF6',
  Bills: '#F59E0B',
  Other: '#E8C6A5',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, transactions, userName, logout } =
    useStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [activeTab, setActiveTab] = useState<'Weekly' | 'Monthly'>('Weekly');

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });
    return { balance: income - expense };
  }, [transactions]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Top App Bar */}
      <View style={[styles.appBar, { paddingTop: insets.top + 10 }]}>
        <View style={styles.logoContainer}>
          <Icon name="wallet" size={28} color={theme.primary} />
          <Text style={[styles.appName, { color: theme.text }]}>
            FinanceCore
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconBtn, { backgroundColor: theme.card }]}
          >
            <Icon
              name={isDarkMode ? 'sunny' : 'moon'}
              size={20}
              color={theme.text}
            />
          </TouchableOpacity>
          {/* Triggers our custom Modal instead of the native Alert */}
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            style={[styles.iconBtn, { backgroundColor: theme.card }]}
          >
            <Icon name="log-out-outline" size={20} color={theme.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.greetingSection}>
              <Text style={[styles.greeting, { color: theme.text }]}>
                Hey, {userName}
              </Text>
              <View style={styles.subtitleBox}>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Add your yesterday's expense
                </Text>
              </View>
            </View>

            <Animated.View entering={FadeInDown.duration(600).springify()}>
              <LinearGradient
                colors={['#E8C6A5', '#57C9A4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.bankName}>FinanceCore</Text>
                  <Icon name="aperture" size={24} color="#FFF" />
                </View>
                <Text style={styles.cardBalance}>
                  {formatCurrency(balance)}
                </Text>
                <Text style={styles.cardNumber}>**** **** **** 0329</Text>
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardLabel}>Card Holder Name</Text>
                    <Text style={styles.cardValue}>
                      {userName?.toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>Expired Date</Text>
                    <Text style={styles.cardValue}>10/28</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Your expenses
            </Text>

            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={[styles.filterContainer, { backgroundColor: theme.card }]}
            >
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  activeTab === 'Weekly' && {
                    backgroundColor: theme.background,
                  },
                ]}
                onPress={() => setActiveTab('Weekly')}
              >
                <Text
                  style={{
                    color:
                      activeTab === 'Weekly' ? theme.text : theme.textSecondary,
                    fontWeight: '600',
                  }}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  activeTab === 'Monthly' && {
                    backgroundColor: theme.background,
                  },
                ]}
                onPress={() => setActiveTab('Monthly')}
              >
                <Text
                  style={{
                    color:
                      activeTab === 'Monthly'
                        ? theme.text
                        : theme.textSecondary,
                    fontWeight: '600',
                  }}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        }
        ListEmptyComponent={
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={[styles.emptyState, { backgroundColor: theme.card }]}
          >
            <Text style={{ color: theme.textSecondary }}>
              No expenses recorded.
            </Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => {
          const catColor = CATEGORY_COLORS[item.category] || theme.primary;
          return (
            <Animated.View
              entering={FadeInRight.delay(index * 100).duration(400)}
              style={[styles.txRow, { backgroundColor: theme.card }]}
            >
              <View style={styles.txLeft}>
                <View
                  style={[styles.iconBox, { backgroundColor: catColor + '15' }]}
                >
                  <Icon
                    name={item.type === 'income' ? 'arrow-down' : 'bag-handle'}
                    size={20}
                    color={catColor}
                  />
                </View>
                <View>
                  <Text style={[styles.txCategory, { color: theme.text }]}>
                    {item.category.toUpperCase()}
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                    {item.date} • {item.note || 'Logged'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.amountPill,
                  { backgroundColor: theme.background },
                ]}
              >
                <Text style={[styles.amountText, { color: theme.text }]}>
                  {item.type === 'income' ? '+' : '-'}${item.amount}
                </Text>
              </View>
            </Animated.View>
          );
        }}
      />

      <Animated.View
        entering={FadeInDown.delay(500).springify()}
        style={[styles.fabContainer, { bottom: insets.bottom + 80 }]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Add')}
          activeOpacity={0.9}
        >
          <Icon name="add" size={32} color="#111827" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={ZoomIn.duration(300).springify()}
            style={[
              styles.modalBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {/* Soft Red Icon Container */}
            <View
              style={[
                styles.modalIconBg,
                { backgroundColor: theme.danger + '15' },
              ]}
            >
              <Icon name="log-out-outline" size={32} color={theme.danger} />
            </View>

            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Sign Out?
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: theme.textSecondary }]}
            >
              Are you sure you want to sign out? This will securely clear your
              name and erase all transaction history from this device.
            </Text>

            {/* Action Buttons */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalBtnText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.danger }]}
                onPress={() => {
                  setShowLogoutModal(false);
                  logout(); 
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appName: { fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  greetingSection: { marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitleBox: {
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  card: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#57C9A4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankName: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '700' },
  cardBalance: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  cardValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

  filterContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },

  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txCategory: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  amountPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  amountText: { fontWeight: 'bold', fontSize: 14 },

  emptyState: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },

  fabContainer: { position: 'absolute', right: 20, zIndex: 100 },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    padding: 24,
    borderRadius: 28,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  modalIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  modalSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  modalButtonsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  modalBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 16, fontWeight: '700' },
});
