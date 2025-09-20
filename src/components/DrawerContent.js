import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';

const DrawerContent = (props) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    
    const userName = user?.name || "Frank";
    const userRating = 5.00;

    return (
        <View style={{ flex: 1, backgroundColor: theme.cardBackground }}>
            {/* Top user profile section */}
            <View style={styles.profileContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name="person-circle-outline" size={60} color={theme.primary} />
                </View>
                <View>
                    <Text style={[styles.userName, { color: theme.text }]}>{userName}</Text>
                    <TouchableOpacity>
                        <Text style={[styles.myAccountText, { color: theme.subText }]}>My account</Text>
                    </TouchableOpacity>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="gold" />
                        <Text style={[styles.ratingText, { color: theme.text }]}>{userRating} Rating</Text>
                    </View>
                </View>
            </View>

            {/* Main menu items */}
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerItemsContainer}>
                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="card-outline" size={24} color={theme.icon} />
                        <Text style={[styles.drawerItemText, { color: theme.text }]}>Payment</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="pricetag-outline" size={24} color={theme.icon} />
                        <Text style={[styles.drawerItemText, { color: theme.text }]}>Promotions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="car-outline" size={24} color={theme.icon} />
                        <Text style={[styles.drawerItemText, { color: theme.text }]}>My Rides</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="shield-outline" size={24} color={theme.icon} />
                        <Text style={[styles.drawerItemText, { color: theme.text }]}>Safety</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="help-circle-outline" size={24} color={theme.icon} />
                        <Text style={[styles.drawerItemText, { color: theme.text }]}>Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}>
                        <Ionicons name="information-circle-outline" size={24} color={theme.icon} />
                        <Text style={[styles.drawerItemText, { color: theme.text }]}>About</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
            
            {/* Section divider */}
            <View style={[styles.divider, { borderBottomColor: theme.border }]} />

            {/* Become a driver is now the only item at the bottom */}
            <View style={[styles.becomeDriverContainer, { backgroundColor: theme.primaryLight }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.becomeDriverText, { color: theme.primary }]}>Become a driver</Text>
                    <Ionicons name="close-circle-outline" size={18} color={theme.subText} style={{ marginLeft: 'auto' }} />
                </View>
                <Text style={[styles.driverSubtitle, { color: theme.subText }]}>Earn money on your schedule</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        paddingTop: 40, // Added more top padding
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    myAccountText: {
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        fontSize: 14,
        marginLeft: 5,
    },
    drawerItemsContainer: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    drawerItemText: {
        fontSize: 16,
        marginLeft: 20,
    },
    divider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 10,
    },
    becomeDriverContainer: {
        margin: 20,
        padding: 15,
        borderRadius: 10,
    },
    becomeDriverText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    driverSubtitle: {
        fontSize: 12,
        marginTop: 5,
    },
});

export default DrawerContent;