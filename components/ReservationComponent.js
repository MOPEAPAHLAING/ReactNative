import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Picker,
  Switch,
  Button,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Card } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import * as Animatable from "react-native-animatable";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      time: new Date(),
      show: false,
      showModal: false,
      mode: "date",
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleReservation() {
    console.log(JSON.stringify(this.state));
    Alert.alert(
      "Your Reservation OK?",
      "Number of Guest: " +
        this.state.guests +
        "\n" +
        "Smoking? " +
        this.state.smoking +
        "\n" +
        "Date and Time: " +
        this.state.date,
      [
        {
          text: "Cancel",
          onPress: () => this.resetForm(),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.presentLocalNotification(this.state.date);
            this.addReservationToCalendar(this.state.date);
            this.resetForm();
          },
        },
      ],
      { cancelable: false }
    );
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date(),
      time: new Date(),
      show: false,
      showModal: false,
      mode: "date",
    });
  }

  async obtainCalendarPermission() {
    let permission = await Permissions.getAsync(Permissions.CALENDAR);
    if (permission.status !== "granted") {
      permission = await Permissions.askAsync(Permissions.CALENDAR);
      if (permission.status !== "granted") {
        Alert.alert("Permission not granted to use calendar");
      }
    }
    return permission;
  }

  async getDefaultCalendarSource() {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendars = calendars.filter(
      (each) => each.source.name === "Default"
    );
    return defaultCalendars[0].id;
  }

  async addReservationToCalendar(date) {
    await this.obtainCalendarPermission();

    console.log("Date: " + date);

    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await this.getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Expo Calendar" };

    let details = {
      title: "Con Fusion Table Reservation",
      source: defaultCalendarSource,
      name: "internalCalendarName",
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      ownerAccount: "personal",
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    };

    const calendarId = await Calendar.createCalendarAsync(details);

    await Calendar.createEventAsync(calendarId, {
      title: "Con Fusion Table Reservation",
      startDate: new Date(Date.parse(date)),
      endDate: new Date(Date.parse(date) + 2 * 60 * 60 * 1000),
      timeZone: 'Asia/Hong_Kong',
      location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
    });

    Alert.alert("Reservation add to your calendar!");
  }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(
      Permissions.USER_FACING_NOTIFICATIONS
    );
    if (permission.status !== "granted") {
      permission = await Permissions.askAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );
      if (permission.status !== "granted") {
        Alert.alert("Permission not granted to show notifications");
      }
    } else {
      if (Platform.OS === "android") {
        Notifications.createChannelAndroidAsync("reservation", {
          name: "Confusion",

          sound: true,

          vibrate: [0, 250, 250, 250],

          priority: "max",
        });
      }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: "Your Reservation",
      body: "Reservation for " + date + " requested",
      ios: {
        sound: true,
      },
      android: {
        channelId: "reservation",
        color: "#512DA8",
      },
    });
  }

  render() {
    const showDatepicker = () => {
      this.setState({ show: true });
    };
    return (
      <ScrollView>
        <Animatable.View animation="zoomInUp" duration={3000}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker
              style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ guests: itemValue })
              }
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
            <Switch
              style={styles.formItem}
              value={this.state.smoking}
              trackColor="#512DA8"
              onValueChange={(value) => this.setState({ smoking: value })}
            ></Switch>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <Text style={styles.formItem} onPress={showDatepicker}>
              {this.state.date.toDateString()} {this.state.time.toTimeString()}
            </Text>
            {this.state.show && (
              <DateTimePicker
                value={this.state.date}
                mode={this.state.mode}
                display="default"
                minimumDate={new Date()}
                onChange={(selected, value) => {
                  if (value !== undefined) {
                    this.setState({
                      show: this.state.mode === "time" ? false : true,
                      mode: "time",
                      date: new Date(selected.nativeEvent.timestamp),
                      time: new Date(selected.nativeEvent.timestamp),
                    });
                  } else {
                    this.setState({ show: false });
                  }
                }}
              />
            )}
          </View>
          <View>
            <Button
              onPress={() => this.handleReservation()}
              title="Reserve"
              color="#512DA8"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#512DA8",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    margin: 10,
  },
});

export default Reservation;
