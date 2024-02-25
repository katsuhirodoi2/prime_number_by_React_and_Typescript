import React, { useState, useEffect } from 'react';
import { Decimal } from 'decimal.js';

const App: React.FC = () => {
  const [inputNumber, setInputNumber] = useState<string>('');
  const [primeNumber, setPrimeNumber] = useState<string | null>(null);
  const [inputDigits, setInputDigits] = useState<number>(0);
  const [primeDigits, setPrimeDigits] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [displayedInputNumber, setDisplayedInputNumber] = useState<string>('');
  const [displayedPrimeNumber, setDisplayedPrimeNumber] = useState<string>('');
  const [calculating, setCalculating] = useState<boolean>(false);

  useEffect(() => {
  }, [calculating]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      findPrimeNumber();
    }
  };

  const findPrimeNumber = () => {
    setCalculating(true);
    setTimeout(() => {
        const num = parseInt(inputNumber);
        if (isNaN(num)) {
        alert('正しい数値を入力してください。');
        setCalculating(false);
        return;
        }
        if (num < 0) {
        //Number型の最大値=9007199254740991
        alert('0以上の自然数を入力してください。');
        setCalculating(false);
        return;
        }

        const startTime = performance.now();
        const decimalNum = new Decimal(inputNumber);
        let candidateD = decimalNum.plus(1);
        let candidate = num + 1;

        if (num > 9007199254740880) {
            // Decimalを使って計算
            while (true) {
                let isPrime = true;
                for (let i = new Decimal(2); i.cmp(candidateD.sqrt()) <= 0; i = i.plus(1)) {
                    if (candidateD.mod(i).eq(0)) {
                        isPrime = false;
                        break;
                    }
                }
                if (isPrime) {
                    setPrimeNumber(candidateD.toString());
                    setPrimeDigits(candidateD.toString().length);
                    break;
                }
                candidateD = candidateD.plus(1);
            }
        } else {
            // numberを使って計算
            while (true) {
                let isPrime = true;
                for (let i = 2; i <= Math.sqrt(candidate); i++) {
                    if (candidate % i === 0) {
                    isPrime = false;
                    break;
                    }
                }
                if (isPrime) {
                    setPrimeNumber(candidate.toString());
                    setPrimeDigits(candidate.toString().length);
                    break;
                }
                candidate++;
            }
        }

        const endTime = performance.now();
        setExecutionTime((endTime - startTime) / 1000); // ミリ秒から秒に変換
        setDisplayedInputNumber(inputNumber);
        if (num > 9007199254740880) {
            setDisplayedPrimeNumber(candidateD.toString());
        } else {
            setDisplayedPrimeNumber(candidate.toString());
        }
        setCalculating(false);
    }, 0); // 0ミリ秒後に処理を実行することで、非同期的に処理中の表示を反映させる
  };

  const formatNumber = (num: number): string => {
    const parts = num.toLocaleString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{4})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const formatKanji = (num: number): string => {
    const units = ["", "万", "億", "兆", "京", "垓", "𥝱", "穣", "溝", "澗", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量大数"];
    let kanji = "";
    let digitGroupIndex = 0;
    while (num > 0) {
      const remainder = num % 10000;
      if (remainder !== 0) {
        kanji = `${remainder}${units[digitGroupIndex]}${kanji}`;
      }
      num = Math.floor(num / 10000);
      digitGroupIndex++;
    }
    return kanji;
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <h1>指定した自然数より大きい素数を1つ表示するプログラム（by React + TypeScript）</h1>
      <p>下のテキストボックスに自然数を入れて「計算」ボタンを押してください。<br />
      入力した自然数よりも大きい素数を1つ出力します。<br />
      なお、9,007,199,254,740,881以上の数を入力した場合、計算時間が一気に長くなります。</p>
      <input
        type="number"
        value={inputNumber}
        onChange={(e) => {
          setInputNumber(e.target.value);
          setInputDigits(e.target.value.length);
        }}
        onKeyPress={handleKeyPress}
        style={{ width: `${Math.max(100, inputDigits * 10)}px` }}
      />
      <button style={{ marginLeft: '10px', width: '70px' }} onClick={findPrimeNumber} disabled={calculating}>
        {calculating ? '計算中...' : '計算'}
      </button>
      {primeNumber !== null && executionTime !== null && !calculating && (
        <p>
          {formatNumber(parseInt(displayedInputNumber))} ({formatKanji(parseInt(displayedInputNumber))}) よりも大きい素数: {formatNumber(parseInt(displayedPrimeNumber))} ({formatKanji(parseInt(displayedPrimeNumber))}), 入力桁数: {displayedInputNumber.length}桁, 素数桁数: {primeDigits}桁
        </p>
      )}
      {executionTime !== null && !calculating && (
        <p>実行時間: {executionTime.toFixed(5)}秒</p>
      )}
    </div>
  );
};

export default App;
