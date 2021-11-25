import { useEffect, useState, useRef } from 'react';
import { interval, fromEvent, bufferWhen, debounceTime, map, filter } from 'rxjs';
import './App.css';

function makeTwoDigit(number) {
  return number.toString().length == 1 ? '0' + number : number
}

const timer = interval(1000)

function App() {
  const waitButton = useRef(null)
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    let subscription = timer.pipe(filter(() => !isPaused)).subscribe(() => setTime((time) => ++time))
    return () => subscription.unsubscribe()
  }, [isPaused])

  useEffect(() => {
    let clicks = fromEvent(waitButton.current, 'click')
    let doubleClicks = clicks.pipe(bufferWhen(() => clicks.pipe(debounceTime(300))), map(clicks => clicks.length), filter(clicksNumber => clicksNumber == 2))
    let subscription = doubleClicks.subscribe(() => setIsPaused(true))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="App">
      <div>
        <div>
          <span>{makeTwoDigit(Math.floor(time / 3600))}:</span>
          <span>{makeTwoDigit(Math.floor(time / 60))}:</span>
          <span>{makeTwoDigit(time % 60)}</span>
        </div>
        <div>
          <button onClick={() => {
            if (isPaused) {
              setIsPaused(false)
            } else {
              setTime(0)
              setIsPaused(true)
            }
            }}>{isPaused ? 'Start' : 'Stop'}</button>
          <button ref={waitButton}>Wait</button>
          <button onClick={() => {
            setTime(0)
            setIsPaused(false)
          }}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
