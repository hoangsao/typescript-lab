import { Button } from "antd";
import React, { SyntheticEvent, useState } from "react";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function Hello ({ name, enthusiasmLevel = 1 }: Props) {
  const [currentEnthusiasm, setCurrentEnthusiasm] = useState(enthusiasmLevel)

  const updateEnthusiasm = (change: number) => {
    const nextEnthusiasm = change + currentEnthusiasm;
    if (nextEnthusiasm <= 0) {
      return
    }
    setCurrentEnthusiasm(change + currentEnthusiasm)
  }

  const onIncrement = (event: SyntheticEvent) => {
    console.log(event)
    updateEnthusiasm(1)
  }

  const onDecrement = (event: SyntheticEvent) => {
    console.log(event)
    updateEnthusiasm(-1)
  }

  if (enthusiasmLevel <= 0) {
    throw new Error("You could be a little more enthusiastic. :D");
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(currentEnthusiasm)}
      </div>
      <Button onClick={onDecrement}>-</Button>
      <Button onClick={onIncrement}>+</Button>
    </div>
  )
}

export default Hello;

function getExclamationMarks (numChars: number) {
  return Array(numChars + 1).join('!');
}