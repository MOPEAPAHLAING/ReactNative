import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { Card, Icon, Rating, Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#F50"
            onPress={() =>
              props.favorite
                ? console.log("Already a favorite")
                : props.onPress()
            }
            style={{ flex: 1 }}
          />
          <Icon
            raised
            reverse
            name={"pencil"}
            type="font-awesome"
            color="#512DA8"
            onPress={() => props.toggleModal()}
            style={{ flex: 1 }}
          />
        </View>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const RenderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}
        </Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={RenderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Card>
  );
}

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRating: 3,
      author: "",
      comment: "",
      showModal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.ratingComplete = this.ratingComplete.bind(this);
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  static navigationOptions = {
    title: "Dish Details",
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  ratingComplete(rating) {
    this.setState({ userRating: rating });
  }

  handleSubmit(dishId, rating, author, comment) {
    console.log(dishId, rating, author, comment);
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );
    this.toggleModal();
  }

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");

    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some((el) => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          toggleModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            (comment) => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <View style={styles.modalRAC}>
              <Rating
                showRating
                type="star"
                fractions={1}
                startingValue={3}
                imageSize={40}
                style={{ paddingVertical: 10 }}
                onFinishRating={this.ratingComplete}
              />
              <Input
                placeholder="Author"
                leftIcon={{ type: "font-awesome", name: "user-o" }}
                onChangeText={(author) => this.setState({ author })}
                containerStyle={{ margin: 10 }}
              />
              <Input
                placeholder="Comment"
                leftIcon={{ type: "font-awesome", name: "comment-o" }}
                onChangeText={(comment) => this.setState({ comment })}
                containerStyle={{ margin: 10 }}
              />
            </View>
            <View style={styles.modalBtn}>
              <Button
                onPress={() =>
                  this.handleSubmit(
                    dishId,
                    this.state.rating,
                    this.state.author,
                    this.state.comment
                  )
                }
                title="SUBMIT"
                color="#512DA8"
                accessibilityLabel="Post your comment"
              />
            </View>
            <View style={styles.modalBtn}>
              <Button
                style={{ marginTop: 10 }}
                onPress={this.toggleModal}
                title="CANCEL"
                color="grey"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalRAC: {
    justifyContent: "center",
    margin: 20,
  },
  modalBtn: {
    justifyContent: "center",
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
