import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

/**
 * Renders the Wallet screen, displaying the user's current balance,
 * and a list of recent transactions. The styles are now dynamic and
 * the screen is optimized for a single-screen layout.
 */
export default function WalletScreen() {
  const { theme } = useTheme();

  // Define dynamic styles based on the current theme.
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    listHeaderContainer: {
      paddingHorizontal: 20,
    },
    cardContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    balanceTitle: {
      fontSize: 18,
      color: theme.text,
      opacity: 0.7,
      marginBottom: 5,
    },
    balanceAmount: {
      fontSize: 48,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    addFundsButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      paddingVertical: 15,
      borderRadius: 12,
      marginBottom: 20,
    },
    addFundsButtonText: {
      color: theme.textOnPrimary,
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 10,
    },
    transactionsHeader: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
      marginTop: 10,
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    transactionDetailsContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    transactionIcon: {
      marginRight: 15,
    },
    transactionDescriptionGroup: {},
    transactionDescription: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    transactionDate: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.6,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: "bold",
    },
    noTransactionsText: {
      fontSize: 16,
      color: theme.text,
      opacity: 0.6,
      textAlign: 'center',
      marginTop: 20,
    }
  });

  // The transactions state is now initialized as an empty array.
  // This is where you would store data fetched from your backend.
  const [transactions, setTransactions] = useState([]);

  /**
   * Renders a single transaction item for the FlatList.
   * @param {Object} item - The transaction data object.
   */
  const renderTransactionItem = ({ item }) => (
    <View style={themedStyles.transactionItem}>
      <View style={themedStyles.transactionDetailsContainer}>
        <Icon
          name={item.type === "credit" ? "arrow-down-circle" : "arrow-up-circle"}
          size={24}
          color={item.type === "credit" ? theme.green : theme.red}
          style={themedStyles.transactionIcon}
        />
        <View style={themedStyles.transactionDescriptionGroup}>
          <Text style={themedStyles.transactionDescription}>{item.description}</Text>
          <Text style={themedStyles.transactionDate}>{item.date}</Text>
        </View>
      </View>
      <Text style={[themedStyles.transactionAmount, { color: item.type === "credit" ? theme.green : theme.red }]}>
        {item.amount}
      </Text>
    </View>
  );

  /**
   * Component to be rendered at the top of the FlatList.
   * This is where all the static content goes to prevent the nesting error.
   */
  const renderListHeader = () => (
    <View style={themedStyles.listHeaderContainer}>
      {/* Balance Card Section */}
      <View style={themedStyles.cardContainer}>
        <Text style={themedStyles.balanceTitle}>Current Balance</Text>
        <Text style={themedStyles.balanceAmount}>$450.50</Text>
      </View>

      {/* "Add Funds" Button */}
      <TouchableOpacity
        style={themedStyles.addFundsButton}
        onPress={() => {
          console.log("Add Funds button pressed!");
        }}
      >
        <Icon name="add-circle-outline" size={24} color={theme.textOnPrimary} />
        <Text style={themedStyles.addFundsButtonText}>Add Funds</Text>
      </TouchableOpacity>
      
      {/* Header for the transaction list */}
      <Text style={themedStyles.transactionsHeader}>Recent Transactions</Text>
    </View>
  );

  return (
    <SafeAreaView style={themedStyles.container}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={themedStyles.container}>
          {renderListHeader()}
          <Text style={themedStyles.noTransactionsText}>No recent transactions.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
