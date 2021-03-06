import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { useTransition } from "react-native-redash";

import { Button, Card, StyleGuide, cards } from "../components";

const { multiply, interpolate, not } = Animated;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
    alignItems: "center"
  }
});

const transformOrigin = -1 * (width / 2 - StyleGuide.spacing * 2);

export default () => {
  const [toggled, setToggled] = useState<0 | 1>(0);
  const transition = useTransition(toggled, not(toggled), toggled);
  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        // let direction = 0;
        // if (index === 0) {
        //   direction = -1;
        // } else if (index === 2) {
        //   direction = 1;
        // }
        const direction = interpolate(index, {
          inputRange: [0, 1, 2],
          outputRange: [-1, 0, 1]
        });
        // const rotate = direction * (toggled ? Math.PI / 6 : 0);
        const rotate = multiply(
          direction,
          interpolate(transition, {
            inputRange: [0, 1],
            outputRange: [0, Math.PI / 6]
          })
        );
        // 3.14 / 6 === 0.52
        return (
          <Animated.View
            key={card.id}
            style={[
              styles.overlay,
              {
                transform: [
                  { translateX: transformOrigin },
                  { rotate },
                  // { rotate: `${rotate}rad}` },
                  { translateX: -transformOrigin }
                ]
              }
            ]}
          >
            <Card {...{ card }} />
          </Animated.View>
        );
      })}
      <Button
        label={toggled ? "Reset" : "Start"}
        primary
        onPress={() => setToggled(toggled ^ 1)}
      />
    </View>
  );
};
