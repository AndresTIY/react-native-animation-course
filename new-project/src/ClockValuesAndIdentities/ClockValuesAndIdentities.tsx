import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { Button, Card, cards } from "../components";
import { useMemoOne } from "use-memo-one";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const {
  Value,
  Clock,
  useCode,
  set,
  block,
  not,
  cond,
  startClock,
  clockRunning,
  stopClock,
  interpolate,
  Extrapolate,
  add,
  eq
} = Animated;
const duration = 2000;

export default () => {
  const [show, setShow] = useState(true);

  const { time, clock, progress } = useMemoOne(
    () => ({
      time: new Value(0),
      clock: new Clock(),
      progress: new Value(0)
    }),
    []
  );
  // const progress = new Value(0);
  // const opacity = new Value(0);
  const opacity = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: show ? [0, 1] : [1, 0],
    extrapolate: Extrapolate.CLAMP
  });
  // const time = new Value(0);
  // const clock = new Clock(); // start value, will update in each frame
  // function to stop the clock so the value will stop updating
  // there is a function to check if clock is running or not

  // useCode(set(opacity, show ? 1 : 0), [show]);
  useCode(
    () =>
      block([
        // 1. if clock isnt running, start the clock and save the original clock value in time
        cond(not(clockRunning(clock)), [startClock(clock), set(time, clock)]),
        // 2. calculate progres of animation
        set(
          progress,
          interpolate(clock, {
            inputRange: [time, add(time, duration)],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP
          })
        ),

        // 3. if animation is over, stop the clock
        cond(eq(progress, 1), stopClock(clock))
      ]),
    [show]
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={{ opacity }}>
          <Card card={cards[0]} />
        </Animated.View>
      </View>
      <Button
        label={show ? "Hide" : "Show"}
        primary
        onPress={() => setShow(!show)}
      />
    </View>
  );
};
