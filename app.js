var app = angular.module('notesApp', []);

app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      element.bind('change', function() {
        scope.$apply(function() {
          model.assign(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

app.controller('NotesCtrl', function($scope, $http,$sce) {
  $scope.activeTab = 'dashboard';
  $scope.metrics = {};
  $scope.featuredNotes = [];
  $scope.trendingSubjects = [];
  $scope.notes = [];
  $scope.uploadedNotes = [];
  $scope.noteTitle = "";
  $scope.noteSubject = "";
  $scope.noteDescription = "";
  $scope.filterSubject = "";
  $scope.userLoggedIn = false;
  $scope.currentUser = "";
  $scope.authModal = false;
  $scope.authTab = "login";
  $scope.error = "";
  $scope.success = "";
  $scope.loginUsername = "";
  $scope.loginPassword = "";
  $scope.userLoginError = "";
  $scope.registerUsername = "";
  $scope.registerPassword = "";
  $scope.registerError = "";
  $scope.registerSuccess = "";
  $scope.adminUsername = "";
  $scope.adminPassword = "";
  $scope.adminLoginError = "";
  $scope.uploadFile = null;
  $scope.uploading = false;

  // Featured tab data arrays
  $scope.featuredCategory = 'top_rated';
  $scope.popularSubjects = [];
  $scope.featuredAuthors = [];
  $scope.announcements = [];

  // Define all $scope functions BEFORE calling any of them
  $scope.loadFeaturedNotes = function(category) {
    // Clear old data
    $scope.featuredNotes = [];
    $scope.popularSubjects = [];
    $scope.featuredAuthors = [];
    $scope.announcements = [];
    $scope.noteCollections = [];
    $scope.topContributors = [];
    $scope.featuredCategory = category;

    $http.get('api/fetch_notes.php', { params: { category: category } })
      .then(function(response) {
        if (category === 'popular_subjects') {
          $scope.popularSubjects = response.data;
        } else if (category === 'featured_authors') {
          $scope.featuredAuthors = response.data;
        } else if (category === 'announcements') {
          $scope.announcements = response.data;
        } else {
          $scope.featuredNotes = response.data;
        }
      }, function(error) {
        console.error("Error fetching featured data for:", category, error);
      });
  };

  $scope.setFeaturedCategory = function(category) {
    $scope.loadFeaturedNotes(category);
  };

  $scope.refreshAll = function() {
    // Fetch metrics
    $http.get('api/metrics.php').then(function(r) {
      $scope.metrics = r.data || {};
    });

    // Load featured notes default category
    $scope.loadFeaturedNotes($scope.featuredCategory);

    // Fetch all notes for trending and browse
    $http.get('api/fetch_notes.php').then(function(r) {
      if (!Array.isArray(r.data)) {
        $scope.trendingSubjects = [];
        $scope.notes = [];
        return;
      }
      // Calculate trending subjects count
      let subjCount = {};
      r.data.forEach(n => subjCount[n.subject] = (subjCount[n.subject] || 0) + 1);
      $scope.trendingSubjects = Object.keys(subjCount).sort((a, b) => subjCount[b] - subjCount[a]).slice(0, 5);
      $scope.notes = r.data;
    });
  };

  function checkSession() {
    $http.get('api/check_user_session.php').then(function(res) {
      if (res.data.user_loggedin) {
        $scope.userLoggedIn = true;
        $scope.currentUser = res.data.username;
      } else {
        $scope.userLoggedIn = false;
        $scope.currentUser = "";
      }
    });
  }

  $scope.setTab = function(tab) {
    $scope.activeTab = tab;
    $scope.error = "";
    $scope.success = "";
    if (tab === 'dashboard' || tab === 'featured') {
      $scope.refreshAll();
    } else if (tab === 'myNotes') {
      $scope.getMyNotes();
    } else if (tab === 'browse') {
      $scope.fetchNotes();
    } else if (tab === 'upload') {
      $scope.noteTitle = '';
      $scope.noteSubject = '';
      $scope.noteDescription = '';
      $scope.uploadFile = null;
      let fileInput = document.getElementById('noteFile');
      if (fileInput) fileInput.value = '';
    }
  };

  $scope.allSubjects = [];
  $scope.allBranches = [];
  $scope.selectedSubject = 'All Subjects';
  $scope.selectedBranch = 'All Branches';

  // Load dynamic dropdown options
  $scope.loadMeta = function() {
      $http.get('api/get_meta.php').then(function(res) {
          if (res.data) {
              $scope.allSubjects = ['All Subjects'].concat(res.data.subjects || []);
              $scope.allBranches = ['All Branches'].concat(res.data.branches || []);
          }
      });
  };

  // Fetch notes with filters applied
  $scope.fetchNotes = function() {
      let params = [];
      if ($scope.selectedSubject && $scope.selectedSubject !== 'All Subjects') {
          params.push('subject=' + encodeURIComponent($scope.selectedSubject));
      }
      if ($scope.selectedBranch && $scope.selectedBranch !== 'All Branches') {
          params.push('category=' + encodeURIComponent($scope.selectedBranch));
      }
      let url = 'api/fetch_notes.php';
      if (params.length) {
          url += '?' + params.join('&');
      }
      $http.get(url).then(res => {
          $scope.notes = Array.isArray(res.data) ? res.data : [];
      });
  };

// Reset filters and fetch all notes
$scope.resetFilters = function() {
    $scope.selectedSubject = 'All Subjects';
    $scope.selectedBranch = 'All Branches';
    $scope.fetchNotes();
};

// Initialization calls
$scope.loadMeta();
$scope.fetchNotes();



  $scope.getMyNotes = function() {
    if (!$scope.userLoggedIn) {
      $scope.uploadedNotes = [];
      return;
    }
    $http.get('api/fetch_notes.php?uploader=' + encodeURIComponent($scope.currentUser)).then(res => {
      $scope.uploadedNotes = Array.isArray(res.data) ? res.data : [];
    });
  };

  $scope.uploadNote = function() {
    $scope.error = '';
    $scope.success = '';

    if (!$scope.userLoggedIn) {
      $scope.error = 'Please login to upload notes.';
      return;
    }
    let title = ($scope.noteTitle || '').trim();
    let subject = ($scope.noteSubject || '').trim();
    let branch = ($scope.noteBranch || '').trim();
    let file = $scope.uploadFile;

    if (!title || !subject || !branch || !file) {
      $scope.error = 'Please fill all the fields including branch and select a file.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      $scope.error = 'File size exceeds 5MB limit.';
      return;
    }
    let ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)) {
      $scope.error = 'Invalid file type. Allowed: pdf, doc, docx, ppt, pptx.';
      return;
    }

    let fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('subject', subject);
    fd.append('branch', branch.toUpperCase()); // send branch in uppercase
    fd.append('description', ($scope.noteDescription || '').trim());

    $scope.uploading = true;
    $http.post('api/upload_note.php', fd, { transformRequest: angular.identity, headers: { 'Content-Type': undefined } })
      .then(res => {
        $scope.uploading = false;
        if (res.data && res.data.success) {
          $scope.success = 'Upload successful!';
          $scope.error = '';
          $scope.noteTitle = '';
          $scope.noteSubject = '';
          $scope.noteBranch = '';
          $scope.noteDescription = '';
          $scope.uploadFile = null;
          let fileInput = document.getElementById('noteFile');
          if (fileInput) fileInput.value = '';
          $scope.refreshAll();
          $scope.getMyNotes();
        } else {
          $scope.error = res.data.error || 'Upload failed.';
        }
      }).catch(() => {
        $scope.uploading = false;
        $scope.error = 'Error occurred during upload.';
      });
  };


  $scope.incrementDownload = function(id) {
    $http.post('api/increment_download.php', { id }).catch(err => {
      console.error('Download increment failed:', err);
    });
  };

  $scope.deleteNote = function(id) {
    if (confirm('Confirm delete this note?')) {
      $http.post('api/delete_note.php', { id }).then(res => {
        if (res.data.success) {
          $scope.refreshAll();
          $scope.getMyNotes();
        } else {
          alert(res.data.error || 'Delete failed.');
        }
      }).catch(() => alert('Delete request failed.'));
    }
  };

  $scope.userLogin = function() {
    $http.post('api/user_login.php', { username: $scope.loginUsername, password: $scope.loginPassword }).then(res => {
      if (res.data.success) {
        $scope.userLoginError = '';
        $scope.userLoggedIn = true;
        $scope.currentUser = $scope.loginUsername;
        $scope.loginUsername = '';
        $scope.loginPassword = '';
        $scope.closeAuthModal();
        $scope.setTab('dashboard');
        $scope.refreshAll();
      } else {
        $scope.userLoginError = res.data.error || 'Login failed.';
      }
    });
  };

  $scope.userRegister = function() {
    if (!$scope.registerUsername || !$scope.registerPassword) {
      $scope.registerError = 'All fields are required.';
      return;
    }
    if ($scope.registerUsername.length < 3 || $scope.registerPassword.length < 3) {
      $scope.registerError = 'Username and password must be at least 3 characters.';
      return;
    }
    $http.post('api/user_register.php', { username: $scope.registerUsername, password: $scope.registerPassword }).then(res => {
      if (res.data.success) {
        $scope.registerError = '';
        $scope.registerUsername = '';
        $scope.registerPassword = '';
        $scope.registerSuccess = 'Registration successful!';
        setTimeout(() => {
          $scope.registerSuccess = '';
          $scope.registerError = '';
          $scope.authTab = 'login';
          $scope.$apply();
        }, 2000);
      } else {
        $scope.registerError = res.data.error || 'Registration failed.';
      }
    });
  };

  $scope.adminLogin = function() {
    $http.post('api/login.php', { username: $scope.adminUsername, password: $scope.adminPassword }).then(res => {
      if (res.data.success) {
        window.location = 'admin.html';
      } else {
        $scope.adminLoginError = res.data.error || 'Admin login failed.';
      }
    });
  };
  
// Like a note and refresh the notes list
  $scope.likeNote = function(noteId) {
    $http.post('api/like_note.php', {id: noteId}).then(function(res) {
      if (res.data.success) $scope.fetchNotes($scope.filterSubject); // Reload after like
    }, function(error) {
      alert("Like Added!");
    });
  };

  // Rate a note and refresh the notes list
  $scope.rateNote = function(noteId, rating) {
    $http.post('api/rate_note.php', {id: noteId, rating: rating}).then(function(res) {
      if (res.data.success) $scope.fetchNotes($scope.filterSubject); // Reload after rating
    }, function(error) {
      alert("Rating Added!");
    });
  };

  $scope.userLogout = function() {
    $http.post('api/user_logout.php').then(() => {
      $scope.userLoggedIn = false;
      $scope.currentUser = '';
      $scope.setTab('dashboard');
      $scope.refreshAll();
      $scope.closeAuthModal();
    });
  };

  $scope.closeAuthModal = function() {
    $scope.authModal = false;
    $scope.loginUsername = '';
    $scope.loginPassword = '';
    $scope.registerUsername = '';
    $scope.registerPassword = '';
    $scope.adminUsername = '';
    $scope.adminPassword = '';
    $scope.userLoginError = '';
    $scope.registerError = '';
    $scope.registerSuccess = '';
    $scope.adminLoginError = '';
  };

  $scope.openAuthModal = function() {
    $scope.authModal = true;
    $scope.authTab = 'login';
    $scope.userLoginError = '';
    $scope.registerError = '';
    $scope.registerSuccess = '';
    $scope.adminLoginError = '';
  };


  // Run initialization
  checkSession();
  $scope.refreshAll();
  
  // chat bot part:
  $scope.aiChatOpen = false;
  $scope.chatMessage = '';
  $scope.chatMessages = [
    { from: 'bot', text: "Hi there! How can I help you today?", html: $sce.trustAsHtml("Hi there! How can I help you today?") }
  ];

  $scope.toggleAIChat = function() {
    $scope.aiChatOpen = !$scope.aiChatOpen;
    if ($scope.aiChatOpen) {
      $scope.chatMessage = '';
    }
  };

  // Helper for formatting bot responses
  function formatBotAnswer(text) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  html = html.replace(/\n/g, '<br>');
  // This block will preserve indentation and any special characters in code
  html = html.replace(/``````/g, function(match, code) {
    // Optional: escape only HTML tags, but leave backticks, slashes, etc.
    code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<div class="ai-chat-code"><pre><code>' + code + '</code></pre></div>';
  });
  return $sce.trustAsHtml(html);
}


  $scope.sendChatMessage = function() {
    if (!$scope.chatMessage.trim()) return;

    $scope.chatMessages.push({ from: 'user', text: $scope.chatMessage });

    // Add bot "typing" indicator
    $scope.chatMessages.push({ from: 'bot', text: 'Typing...', typing: true });

    var payload = { message: $scope.chatMessage.trim() };
    var userQuestion = $scope.chatMessage.trim();
    $scope.chatMessage = '';

    $http.post('api/ai_chat.php', payload)
      .then(function(response) {
        // Remove typing indicator
        var typingIndex = $scope.chatMessages.findIndex(m => m.typing);
        if (typingIndex !== -1) $scope.chatMessages.splice(typingIndex, 1);

        var botText = response.data.answer ? response.data.answer : 'Sorry, no response from server.';
        $scope.chatMessages.push({
          from: 'bot',
          question: userQuestion,
          text: botText,
          html: formatBotAnswer(botText)
        });
      }, function() {
        var typingIndex = $scope.chatMessages.findIndex(m => m.typing);
        if (typingIndex !== -1) $scope.chatMessages.splice(typingIndex, 1);

        var botText = 'Error communicating with server.';
        $scope.chatMessages.push({
          from: 'bot',
          question: userQuestion, 
          text: botText,
          html: formatBotAnswer(botText)
        });
      });
  };
});
