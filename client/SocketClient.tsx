import { Player, usePlayersStore } from '@/store/usePlayersStore'
import { useEffect } from 'react'
import { socket } from './socketConfig'

export const SocketClient = () => {
  const { setPlayers, me, setMe } = usePlayersStore()

  useEffect(() => {
    const handleConnect = () => {
      console.info('Connected')
    }

    const handleDisconnect = () => {
      console.info('Disconnected')
    }

    const handleInitialize = (value: Player) => {
      console.log(value)
      setMe(value)
      console.info('Initialized')
    }

    const handleEnter = () => {
      console.info('Entered')
    }

    const handleExit = () => {
      console.info('Exited')
    }

    const handlePlayers = (value: Player[]) => {
      setPlayers(value)
      const newMe = value.find((p) => p && me && p.id === me.id)
      console.log('newMe', newMe)
      if (newMe) {
        setMe(newMe)
      }
    }

    const handleNewText = () => {
      console.info('새로운 텍스트')
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('initialize', handleInitialize)
    socket.on('enter', handleEnter)
    socket.on('exit', handleExit)
    socket.on('players', handlePlayers)
    socket.on('newText', handleNewText)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('initialize', handleInitialize)
      socket.off('enter', handleEnter)
      socket.off('exit', handleExit)
      socket.off('players', handlePlayers)
      socket.off('newText', handleNewText)
    }
  }, [me, setMe, setPlayers])
}
