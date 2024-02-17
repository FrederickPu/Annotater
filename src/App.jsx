import './App.css';
import PastSelector from './components/NavBar/PastSelector';
import PageContent from './components/Content/PageContent';
import CommentSection from './components/Content/CommentSection';

const App = () => {
  return (
    <>
      <PastSelector />
      <div className='contentContainer'>
        <PageContent />
        <CommentSection />
      </div>
    </>
  )
}

export default App
