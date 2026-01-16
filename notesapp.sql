-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 03, 2025 at 12:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `notesapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin123'),
(2, 'dhruv', 'raj111');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `created_at`) VALUES
(1, 'Server Update: New Features Added!', 'We’re excited to announce that new features have been added to make our platform more useful and engaging for everyone! 🌟\r\nBe sure to contribute actively, support your fellow colleagues, and let’s continue growing together as a community. 💪✨', '2025-09-27 13:22:00'),
(2, '📢 Attention: Missing Notes Alert', 'We’re currently looking for notes in the following subjects:\r\n\r\nDatabase Management Systems (DBMS)\r\n\r\nOperating Systems\r\n\r\nDiscrete Mathematics\r\nIf you have any of these, please upload them or reach out to the admin team.\r\nYour contribution will be credited and appreciated by the community! 🙌', '2025-07-23 13:26:24'),
(3, '🎓 Study Smart with Shared Resources', 'Stay ahead this semester by exploring our latest uploads and most downloaded notes.\r\nUse the search bar to quickly find exactly what you need.\r\nNew content is being added daily — check back often! 🔍✨', '2025-08-06 07:33:05'),
(4, '📢 New Feature Update – Smarter Browsing System!', 'We’ve added an enhanced browsing experience to make finding your notes easier than ever! 🎯\r\n\r\n✅ New Dropdown Filters – Now you can quickly browse notes by Subject and Branch without typing manually.\r\n✅ Faster Search – Just select your preferred category and get instant results.\r\n✅ Cleaner UI – The browsing section is now more organized and user-friendly.', '2025-10-01 21:59:01'),
(5, '📢 New Chat Bot in Campus Notes Hub! 🤖💬', 'Ask questions instantly and get smart, text-based answers right inside your browser tab—no need to switch apps!\r\nJust click the chat icon at the bottom-right to start.\r\n\r\n✨ Features:\r\n\r\nFast help for notes, subjects, and study queries 📚\r\n\r\nText chat only—no image or document uploads 📝\r\n\r\nAvailable only in the current browser tab 🌐\r\n\r\nTry it now and make your learning even easier! 🚀', '2025-10-02 16:37:00');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `uploaded_by` varchar(100) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `downloads` int(11) DEFAULT 0,
  `rating` float DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `featured_flag` tinyint(1) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `branch` varchar(100) NOT NULL DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `title`, `subject`, `description`, `filename`, `uploaded_by`, `uploaded_at`, `downloads`, `rating`, `likes`, `featured_flag`, `featured`, `branch`) VALUES
(7, 'unit-1', 'DAA', 'Bubble Sort\\r\\nSelection Sort\\r\\nInsertion Sort', 'note_68c741bc92b039.52851971_unit-1 daa.pdf', 'dhruvil', '2025-09-14 22:29:16', 1, 4, 3, 1, 0, 'CSE'),
(8, 'unit-3', 'DAA', '-The Principle of Optimality\\r\\n-Making Change Problem\\r\\n-Knapsack problem\\r\\n-Matrix chain multiplication\\r\\n-Longest Common Subsequence\\r\\n-Backtracking and Branch & Bound– The Knapsack Problem, The Eight -Queens problem.', 'note_68c742002ea3d8.39531591_unit-3 daa.pdf', 'dhruvil', '2025-09-14 22:30:24', 2, 3, 5, 1, 1, 'CSE'),
(9, 'assignment-1', 'CN', 'For MSE', 'note_68c7425b91acb4.54929322_Assignment 1_CN.pdf', 'priya', '2025-09-14 22:31:55', 3, 1, 3, 0, 0, 'General'),
(10, 'QB', 'CN', 'IMP for exam', 'note_68c7427ba18173.59632430_Final CE0518_CN_Question bank .pdf', 'priya', '2025-09-14 22:32:27', 1, 1, 7, 0, 0, 'General'),
(16, 'abc', 'RMPV', 'erwf', 'note_68dd431709ba14.12727047_Assignment 3_RMPV.pdf', 'dhruvil', '2025-10-01 15:04:55', 1, 0, 1, 0, 0, 'CSE'),
(17, 'QB', 'AMP', 'MSE-QB', 'note_68de249f2faad0.61645810_amp.pdf', 'Raj', '2025-10-02 07:07:11', 5, 4, 3, 0, 0, 'I.T.'),
(18, 'my_note', 'db', 'reference note', 'note_68df80d26398d5.20412272_Assignment 3_RMPV.pdf', 'khushil', '2025-10-03 07:52:50', 0, 0, 0, 0, 0, 'ICT');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'dhruvil', '123'),
(2, 'priya', '123'),
(9, 'Raj', '123'),
(10, 'khushil', 'khushil123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
