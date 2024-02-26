import './App.css';
import PastSelector from './components/NavBar/PastSelector';
import PageContent from './components/Content/PageContent';
import CommentSection from './components/Content/CommentSection';
import Highlight from './components/Highlight'

const App = () => {
  return (
    <>
      {/* <PastSelector />
      <div className='contentContainer'>
        <PageContent />
        <CommentSection />
      </div> */}
      <Highlight />
    </>
  )
}

export default App
