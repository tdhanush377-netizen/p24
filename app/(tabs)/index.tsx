import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [isPremium, setIsPremium] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [tempName, setTempName] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  /* ---------- Helpers ---------- */
  const isValidEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const isFormValid =
    tempName.trim().length > 0 && isValidEmail(tempEmail);

  /* ---------- Logout (FIXED) ---------- */
  const handleLogout = () => {
    router.replace("/");
  };

  /* ---------- Image Picker ---------- */
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  /* ---------- Activate Premium ---------- */
  const activatePremium = () => {
    if (!isFormValid) return;

    setFullName(tempName.trim());
    setEmail(tempEmail.trim());
    setIsPremium(true);
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.canGoBack() && router.back()}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImg} />
              ) : (
                <Ionicons name="person-outline" size={42} color="#fff" />
              )}
            </View>
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={13} />
            </View>
          </TouchableOpacity>

          <View style={[styles.planTag, isPremium && styles.premiumTag]}>
            {isPremium && (
              <MaterialCommunityIcons name="crown" size={11} color="#fff" />
            )}
            <Text style={[styles.planTagText, isPremium && { color: "#fff" }]}>
              {isPremium ? "Premium Plan" : "Starter Plan"}
            </Text>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.card}>
          <Field label="Mobile Number" value="+91 98765 43210" />
          <Field
            label="Name"
            value={isPremium ? fullName : "Upgrade to Premium to add name"}
            disabled={!isPremium}
          />
          <Field
            label="Email"
            value={isPremium ? email : "Upgrade to Premium to add email"}
            disabled={!isPremium}
          />
        </View>

        {/* Subscription */}
        <Text style={styles.sectionTitle}>Subscription Plan</Text>

        <View style={[styles.card, isPremium && styles.premiumCard]}>
          <View style={styles.planRow}>
            <MaterialCommunityIcons name="flash" size={16} color="#7C5CFF" />
            <Text style={styles.planName}>
              {isPremium ? "Premium Plan" : "Starter Plan"}
            </Text>
          </View>

          <Text style={styles.planDesc}>
            {isPremium
              ? "Full access to all premium features"
              : "Basic features to get started"}
          </Text>

          <Check text="Mobile number verification" />
          <Check text="Basic profile access" />

          {isPremium && (
            <>
              <Check text="Add & edit name and email" />
              <Check text="Priority support" />
              <Check text="Advanced features access" />
            </>
          )}

          {!isPremium && (
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={16} color="#E53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===== MODAL ===== */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.crownCircle}>
                <MaterialCommunityIcons name="crown" size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Upgrade to Premium</Text>
                <Text style={styles.modalSub}>Complete your profile</Text>
              </View>
            </View>

            <Text style={styles.modalInfo}>
              Please enter your name and a valid email address.
            </Text>

            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              placeholder="Enter your name"
              value={tempName}
              onChangeText={setTempName}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              placeholder="Enter your email"
              value={tempEmail}
              onChangeText={(text) => {
                setTempEmail(text);
                setEmailError(
                  text.length === 0 || isValidEmail(text)
                    ? ""
                    : "Please enter a valid email address"
                );
              }}
              style={styles.input}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.activateBtn,
                  !isFormValid && styles.disabledBtn,
                ]}
                disabled={!isFormValid}
                onPress={activatePremium}
              >
                <Text style={styles.activateText}>Activate Premium</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */
function Field({ label, value, disabled }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, disabled && styles.disabled]}>
        <Text style={styles.inputText}>{value}</Text>
      </View>
    </View>
  );
}

function Check({ text }: { text: string }) {
  return (
    <View style={styles.checkRow}>
      <Ionicons name="checkmark" size={12} color="#4CAF50" />
      <Text style={styles.checkText}>{text}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 24 : 10,
    paddingBottom: 12,
  },
  backBtn: { width: 40 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18 },
  avatarWrapper: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#7C5CFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 14,
  },
  planTag: {
    marginTop: 10,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: "row",
    gap: 6,
  },
  premiumTag: { backgroundColor: "#7C5CFF" },
  planTagText: { fontSize: 12, color: "#5C6BC0" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
  },
  premiumCard: {
    borderColor: "#C7B7FF",
    borderWidth: 1,
    backgroundColor: "#F8F6FF",
  },
  label: { color: "#777" },
  inputBox: {
    backgroundColor: "#F4F6FA",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  inputText: { color: "#555" },
  disabled: { opacity: 0.6 },
  sectionTitle: { marginLeft: 16, fontWeight: "600" },
  planRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  planName: { fontWeight: "600" },
  planDesc: { fontSize: 12, color: "#777", marginVertical: 6 },
  checkRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  checkText: { fontSize: 12 },
  upgradeBtn: {
    marginTop: 16,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  upgradeText: { color: "#fff", fontWeight: "600" },
  logoutBtn: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#F44336",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  logoutText: { color: "#E53935" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: { backgroundColor: "#fff", borderRadius: 20, padding: 16 },
  modalHeader: { flexDirection: "row", gap: 12, alignItems: "center" },
  crownCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7C5CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: { fontSize: 16, fontWeight: "600" },
  modalSub: { color: "#777", fontSize: 12 },
  modalInfo: { color: "#555", fontSize: 13, marginVertical: 12 },
  inputLabel: { fontSize: 12, color: "#555", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  errorText: { color: "#E53935", fontSize: 12, marginTop: 4 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F1F3F8",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  activateBtn: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledBtn: { opacity: 0.5 },
  activateText: { color: "#fff", fontWeight: "600" },
});
