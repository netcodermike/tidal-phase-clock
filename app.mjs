import { readFileSync } from 'node:fs'

function analyze({elapsed,period,amplitude,mean}) {
  if (![elapsed,period,amplitude,mean].every(Number.isFinite)||period<=0||amplitude<0)
    throw new Error('Invalid tide-model parameters')
  const cycle=((elapsed%period)+period)%period/period
  const height=mean+amplitude*Math.cos(2*Math.PI*cycle)
  if(!Number.isFinite(height))throw new Error('Modeled height exceeds the supported range')
  const trend=amplitude===0||cycle===0||cycle===.5?'turning or flat':cycle<.5?'falling':'rising'
  return {phaseDegrees:Number((360*cycle).toFixed(8)),height:Number(height.toFixed(8)),trend}
}

try {
  if (process.argv.length !== 3) throw new Error('Usage: node app.mjs input.json')
  console.log(JSON.stringify(analyze(JSON.parse(readFileSync(process.argv[2], 'utf8')))))
} catch (error) {
  console.error(error.message)
  process.exitCode = 2
}
