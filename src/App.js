import {useState} from 'react';
import UAParser from 'ua-parser-js';
// import NetworkSpeed from 'network-speed';
import './App.css';
import { Buffer } from 'buffer';
import process from "process";


window.Buffer = Buffer;
window.process = process;


const generateMarkup = (name, value) => <p><b>{name}:</b> {value}</p>
const parser = new UAParser();

function factor(depth) {
    let f = 1;
    for (let i = 1; i < depth; i++) {
        f = f * i;
    }
    return f;
}

const calculate = callback => {
    const t0 = performance.now();
    for (let n = 1; n < 100000; n++) {
        factor(100000);
    }
    const t1 = performance.now();
    callback(false);
    return (t1 - t0).toFixed(0);
}

// const testNetworkSpeed = new NetworkSpeed();

// getNetworkDownloadSpeed();
//
// async function getNetworkDownloadSpeed() {
//     const baseUrl = 'https://filedoge.com/download/c404176fe47bd5207ea582cd6b5d03924086096cfaf9a80cfe7fcfad094eb23c6e4a6608270cd15a2f84';
//     const fileSizeInBytes = 500000;
//     const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
//     console.log(speed);
// }
//
// getNetworkUploadSpeed();
//
// async function getNetworkUploadSpeed() {
//     const options = {
//         hostname: 'https://api.filedoge.com/upload',
//         port: 80,
//         path: '/catchers/544b09b4599c1d0200000289',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     };
//     const fileSizeInBytes = 2000000
//     const speed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);
//     console.log(speed);
// }

function App() {

    const [calculating, setCalculating] = useState(false);
    const [duration, setDuration] = useState(0);

    const runCalculating = () => {
        setCalculating(true);
        setTimeout(() => {
            setDuration(calculate(setCalculating));
        }, 100);
    }

    return (
        <div className="App">
            {generateMarkup('Клиент (User Agent)', window.navigator.userAgent)}
            {generateMarkup('Название браузера', parser.getBrowser().name)}
            {generateMarkup('Версия браузера', parser.getBrowser().version)}
            {generateMarkup('Архитектура CPU', parser.getCPU().architecture ?? 'не определено')}
            {generateMarkup('Количество ядер CPU', window.navigator.hardwareConcurrency)}
            {generateMarkup('Приблизительный объем оперативной памяти в ГиБ', window.navigator.deviceMemory)}
            {generateMarkup('Название ОС', parser.getOS().name)}
            {generateMarkup('Версия ОС', parser.getOS().version)}
            <hr/>
            <p>
                Тестовый скрипт: расчет факториала числа.<br/>
                Количество итераций n-факториала: 100000.<br/>
                Количество итераций цикла расчёта: 100000.
            </p>
            <p>
                <button onClick={runCalculating} disabled={calculating}>Запустить скрипт</button>
            </p>
            {calculating
                ? <span className="calculating">Выполнение...</span>
                : <span>Длительность выполнения: <span className="calculating">{duration}</span> милисекунд</span>
            }
            <hr/>
        </div>
    );
}

export default App;
