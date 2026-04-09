import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Animated, { FadeInDown } from 'react-native-reanimated';
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

export default function SummaryScreen() {
  const { isDarkMode, transactions } = useStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [focusedCategory, setFocusedCategory] = useState<{
    category: string;
    amount: number;
    color: string;
  } | null>(null);

  const { pieData, totalExpense, totalIncome } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach(tx => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
        categoryTotals[tx.category] =
          (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const formattedPieData = Object.keys(categoryTotals).map(key => {
      const isFocused = focusedCategory?.category === key;
      const catColor = CATEGORY_COLORS[key] || '#A1A1AA';

      return {
        value: categoryTotals[key],
        color: catColor,
        text: key,
        focused: isFocused, 
        onPress: () => {
          if (isFocused) {
            setFocusedCategory(null);
          } else {
            setFocusedCategory({
              category: key,
              amount: categoryTotals[key],
              color: catColor,
            });
          }
        },
      };
    });

    return {
      pieData: formattedPieData,
      totalExpense: expense,
      totalIncome: income,
    };
  }, [transactions, focusedCategory]); 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Summary</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          style={styles.topCardsContainer}
        >
          <View style={[styles.miniCard, { backgroundColor: theme.card }]}>
            <Text
              style={[styles.miniCardLabel, { color: theme.textSecondary }]}
            >
              Income
            </Text>
            <Text style={[styles.incomeValue, { color: theme.success }]}>
              +{formatCurrency(totalIncome)}
            </Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: theme.card }]}>
            <Text
              style={[styles.miniCardLabel, { color: theme.textSecondary }]}
            >
              Expense
            </Text>
            <Text style={[styles.expenseValue, { color: theme.danger }]}>
              -{formatCurrency(totalExpense)}
            </Text>
          </View>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Expense Breakdown
        </Text>

        {totalExpense > 0 ? (
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            style={[styles.chartContainer, { backgroundColor: theme.card }]}
          >
            <PieChart
              data={pieData}
              donut
              radius={120}
              innerRadius={95} 
              isAnimated
              animationDuration={1000}
              showText={false}
              strokeWidth={4}
              strokeColor={theme.card}
              focusOnPress
              extraRadius={10}
              centerLabelComponent={() => {
                const displayAmount = focusedCategory
                  ? formatCurrency(focusedCategory.amount)
                  : formatCurrency(totalExpense);
                const displayTitle = focusedCategory
                  ? focusedCategory.category
                  : 'Total Spent';
                const displayColor = focusedCategory
                  ? focusedCategory.color
                  : theme.text;

                return (
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        fontSize: 28,
                        color: displayColor,
                        fontWeight: 'bold',
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {displayAmount}
                    </Text>

                    <View
                      style={{
                        height: 2,
                        backgroundColor: theme.border,
                        width: 40,
                        marginVertical: 8,
                        borderRadius: 2,
                      }}
                    />

                    <Text
                      style={{
                        fontSize: 14,
                        color: theme.textSecondary,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {displayTitle}
                    </Text>
                  </View>
                );
              }}
            />

            <View style={styles.legendContainer}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <View>
                    <Text
                      style={{
                        color: theme.text,
                        fontWeight: '600',
                        fontSize: 14,
                      }}
                    >
                      {item.text}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                      {formatCurrency(item.value)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={[styles.emptyState, { backgroundColor: theme.card }]}
          >
            <Text style={{ color: theme.textSecondary }}>
              No expenses recorded yet.
            </Text>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20 },

  topCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 30,
    marginTop: 10,
  },
  miniCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  miniCardLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  incomeValue: { fontSize: 20, fontWeight: 'bold' },
  expenseValue: { fontSize: 20, fontWeight: 'bold' },

  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },

  chartContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 40,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '45%',
  },
  legendColor: { width: 14, height: 14, borderRadius: 7 },

  emptyState: { padding: 40, borderRadius: 24, alignItems: 'center' },
});
