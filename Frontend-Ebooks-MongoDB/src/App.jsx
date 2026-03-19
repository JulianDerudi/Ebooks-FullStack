import { Route, Routes } from "react-router"
import HomeScreen from "./Screens/HomeScreen/HomeScreen"
import EbookDetailScreen from "./Screens/EbookDetailScreen/EbookDetailScreen"
import ChapterReaderScreen from "./Screens/ChapterReaderScreen/ChapterReaderScreen"
import EbookDetailContextProvider, { EbookDetailContext } from "./Context/EbookDetailContext"
import EbookContextProvider from "./Context/EbookContext"
import AddEbookScreen from "./Screens/AddEbookScreen/AddEbookScreen"
import LoginScreen from "./Screens/LoginScreen/LoginScreen"
import RegisterScreen from "./Screens/RegisterScreen/RegisterScreen"
import ProfileScreen from "./Screens/ProfileScreen/ProfileScreen"
import EditProfileScreen from "./Screens/EditProfileScreen/EditProfileScreen"
import EditChaptersScreen from "./Screens/EditChaptersScreen/EditChaptersScreen";
import Header from "./Components/Header/Header"

function App() {

  return (
    <EbookContextProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/profile/:userId" element={<ProfileScreen />} />
        <Route path="/profile/edit" element={<EditProfileScreen />} />
        <Route path="/edit-chapters/:id" element={<EditChaptersScreen />} />
        <Route path="/ebook/:id" element={
          <EbookDetailContextProvider>
            <EbookDetailScreen />
          </EbookDetailContextProvider>
        } />
        <Route path="/ebook/:id/chapter/:chapterId" element={<ChapterReaderScreen />} />
        <Route path="/add-ebook" element={<AddEbookScreen />} />
      </Routes>
    </EbookContextProvider>
  )
}

export default App
