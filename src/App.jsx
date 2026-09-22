import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
function App() {
  const [count, setCount] = useState(0)
  // check for current input
  function handleclickadd(){
    setCount(count+1)
  }
  function handleclickremove(){
    setCount(count-1)
  }
  function add(){
    if(inputs.trim ===""){
      return;
    }
    setTask([...task,{text:inputs, completed: false}]);
    setinputs("");
  }
  function deletes(){
    setinputs("");
  }
  function removetask(indexToDelete){
    setTask(task.filter((_,index)=> index !== indexToDelete))
  }
  function handlecheck(toggleIndex){
    setTask(task.map((item,index) =>{
      if(index === toggleIndex){
        return(
          {...item,completed:!item.completed}
    )
  }
  return item;
    }))
  }
  return (
  <>
    <div className='m-10'>
      <Header/>
      <main>
      <Home/>
      </main>
      <Footer/>
    </div>
    </>
  )
}
export default App
