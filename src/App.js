import {useEffect, useState} from 'react';
import UAParser from 'ua-parser-js';
import './App.css';
import {Buffer} from 'buffer';
import process from 'process';
import {downloadSpeedTest, uploadSpeedTest} from './utils/network_speed';


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

const baseUrl = '/api/read.php';
const fileSizeInBytes = 6705403;

const testDownload = async callback => {
    const {bps, kbps, mbps} = await downloadSpeedTest(baseUrl, fileSizeInBytes);
    callback({bps, kbps, mbps});
}

const testUpload = async callback => {
    const options = {
        path: '/api/write.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const {bps, kbps, mbps} = await uploadSpeedTest(options, fileSizeInBytes);
    callback({bps, kbps, mbps});
}

function App() {

    const [calculating, setCalculating] = useState(false);
    const [dSpeed, setDSpeed] = useState(null);
    const [uSpeed, setUSpeed] = useState(null);
    const [duration, setDuration] = useState(0);

    const runCalculating = () => {
        setCalculating(true);
        setTimeout(() => {
            setDuration(calculate(setCalculating));
        }, 100);
    }

    useEffect(() => {
        setDSpeed(null);
        setUSpeed(null);
        testDownload(setDSpeed);
        testUpload(setUSpeed);
    }, []);

    return (
        <div className="App">
            {generateMarkup('Клиент (User Agent)', window.navigator.userAgent)}
            {generateMarkup('Название браузера', parser.getBrowser().name)}
            {generateMarkup('Версия браузера', parser.getBrowser().version)}
            {generateMarkup('Архитектура CPU', parser.getCPU().architecture ?? 'не определено')}
            {generateMarkup('Количество ядер CPU', window.navigator?.hardwareConcurrency ?? 'не определено')}
            {generateMarkup('Приблизительный объем оперативной памяти в ГиБ', window.navigator?.deviceMemory ?? 'не определено')}
            {generateMarkup('Название ОС', parser.getOS().name)}
            {generateMarkup('Версия ОС', parser.getOS().version)}
            <hr/>
            <p>
                <b>Тестовый скрипт: расчет факториала числа</b><br/>
                Количество итераций n-факториала: 100000.<br/>
                Количество итераций цикла расчёта: 100000.
            </p>
            <p>
                <button onClick={runCalculating} disabled={calculating}>Запустить скрипт</button>
            </p>
            {calculating
                ? <span className="calculating"> Выполнение...</span>
                : <span>Длительность выполнения: <span className="calculating">{duration / 1000} сек</span></span>
            }
            <hr/>
            <p><b>Скачивание и загрузка данных размером 6,39 МБ (6705403 байт):</b></p>
            <p>Скорость скачивания:
                {dSpeed === null
                    ? <span className="calculating"> Выполнение...</span>
                    : <span id="download" className="calculating">{` ${dSpeed.mbps} МБит/сек`}</span>
                }
            </p>
            <p>
                Скорость загрузки:
                {uSpeed === null
                    ? <span className="calculating"> Выполнение...</span>
                    : <span id="upload" className="calculating">{` ${uSpeed.mbps} МБит/сек`}</span>
                }
            </p>
        </div>
    );
}

export default App;
