import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from '../styles/profile.module.css'
import { Layout } from '../components/Layout/Layout'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getGenres } from '../apis/genre'
import { useQuery } from 'react-query'
import { deleteTicket, getTickets } from '../apis/ticket'
import { ProfileSideBar } from '../components/Profile/ProfileSideBar'
import { Ticket } from '../types/ticket'
import { TicketList } from '../components/Tickets/TicketList'
import { SidePanel } from '../components/Panel/SidePanel'
import { TicketForm } from '../components/Tickets/TicketForm'

const Profile: React.FC = () => {
  const { data: genres } = useQuery(['genres'], getGenres)
  const { data: tickets, refetch: refreshTickets } = useQuery(['tickets'], () => getTickets())

  const [scores, setScores] = useState<number[]>([])
  const [doneTickets, setDoneTickets] = useState<Ticket[]>([])
  const [openEditDrawer, setOpenEditDrawer] = useState(false)
  const [clickedTicket, setClickedTicket] = useState<Ticket>()

  const handleClickTicketCard = useCallback((ticket: Ticket) => {
    setOpenEditDrawer(true)
    setClickedTicket(ticket)
  }, [])

  useEffect(() => {
    const newScores = genres?.map((genre) => {
      const filteredTickets = tickets?.filter(
        (ticket) => ticket.status === 'done' && ticket.Genre.id === genre.id
      )

      return filteredTickets?.length ?? 0
    })
    setScores(newScores ?? [])
  }, [tickets])

  useEffect(() => {
    setDoneTickets(tickets?.filter((ticket) => ticket.status === 'done') ?? [])
  }, [tickets])

  // Highchartsのオプション設定
  const options = useMemo(
    () => ({
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: genres?.map((item) => item.title),
        labels: {
          style: {
            fontSize: '14px',
          },
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          style: {
            fontSize: '12px',
            color: '#636366',
          },
        },
        plotLines: [
          {
            value: 0, // 点数が0の位置にプロットラインを追加
            color: '#e4e4e4',
            width: 1,
            zIndex: 5,
          },
        ],
        gridLineColor: '#e4e4e4',
      },

      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'スコア',
          data: scores,
        },
      ],
      credits: {
        enabled: false,
      },
      plotOptions: {
        responsive: {},
        column: {
          // 棒の色を変更
          // color: 'blue',
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              minWidth: 100,
            },
          },
        ],
      },
    }),
    [genres, scores]
  )

  return (
    <>
      <Layout>
        <div className={styles.contents}>
          <div className={styles.wrapper}>
            <div className={styles.profile}>
              <div className={styles.profileContents}>
                <ProfileSideBar />
              </div>
            </div>
            <div className={styles.data}>
              <div className="w-full">
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
              <TicketList
                tickets={doneTickets}
                status="done"
                onClick={handleClickTicketCard}
                direction="row"
                noItemMessage="完了したチケットはありません"
              />
            </div>
          </div>
        </div>
        <SidePanel
          open={openEditDrawer}
          title="チケットを編集する"
          onClose={() => setOpenEditDrawer(false)}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onDelete={async () => {
            if (clickedTicket) {
              await deleteTicket(clickedTicket.id)
              void refreshTickets()
            }
            setOpenEditDrawer(false)
          }}>
          <TicketForm ticket={clickedTicket} onClose={() => setOpenEditDrawer(false)} />
        </SidePanel>
      </Layout>
    </>
  )
}

export default Profile
