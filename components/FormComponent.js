import React, { Component } from 'react';
import { View } from 'react-native';
import { Rating, Input, Icon } from 'react-native-elements';

class CommentForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            userRating: 3
        }
    }
    
    ratingComplete(rating){
        this.setState({userRating : rating})
    }

    handelComments

    render(){
        return(
            <View>
                <View style={styles.formRow}>
                    <Rating
                        showRating
                        type="star"
                        fractions={1}
                        startingValue={3}
                        imageSize={40}
                        style={{ paddingVertical: 10 }}
                        onFinishRating={ this.ratingComplete }
                    />
                    <Input 
                        placeholder='Authour'
                        leftIcon={
                            <Icon
                                type='font-awesome'
                                name='user'
                                size={24}
                                color={tintColor}
                            />
                        }
                    />
                    <Input
                        placeholder='Comment'
                        leftIcon={
                            <Icon
                                type='font-awesome'
                                name='comment'
                                size={24}
                                color={tintColor}
                            />
                        }
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.handelComments()}
                        title="SUBMIT"
                        color="#512DA8"
                        accessibilityLabel="Post your commets"
                    />
                    <Button
                        title="CANCEL"
                        color="#888"
                        accessibilityLabel="Dismiss Form"
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection: "row",
        margin: 20,
    }
})

export default CommentForm;