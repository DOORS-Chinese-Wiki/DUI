import { Button, Layout, LobbyMenu, Space } from '../../components';
import styles from './LobbyExample.module.css';

function PlayGlyph() {
  return (
    <svg viewBox="0 0 56 66" aria-hidden="true">
      <path d="M0 0 56 33 0 66z" fill="currentColor" />
    </svg>
  );
}

export default function LobbyExample() {
  return (
    <Layout maxWidth="full" padding="none" className={styles.lobbyStage}>
      <Space direction="vertical" size="sm" align="center" className={styles.lobbyStack}>
        <Button className={styles.hostButton} leadingIcon={<PlayGlyph />}>
          HOST GAME
        </Button>
        <LobbyMenu />
      </Space>
    </Layout>
  );
}
