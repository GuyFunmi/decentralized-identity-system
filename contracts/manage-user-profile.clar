;; Define the map to store user profiles
(define-map user-profiles
  {user: principal}
  {bio: (string-utf8 280), avatar-url: (optional (string-ascii 256)), social-links: (list 5 (string-ascii 100))})

;; Create or update a user profile
(define-public (set-profile (bio (string-utf8 280)) (avatar-url (optional (string-ascii 256))) (social-links (list 5 (string-ascii 100))))
  (ok (map-set user-profiles {user: tx-sender} {bio: bio, avatar-url: avatar-url, social-links: social-links})))

;; Get a user's profile
(define-read-only (get-profile (user principal))
  (map-get? user-profiles {user: user}))

;; Delete a user's profile
(define-public (delete-profile)
  (ok (map-delete user-profiles {user: tx-sender})))

;; Check if a user has a profile
(define-read-only (has-profile (user principal))
  (is-some (map-get? user-profiles {user: user})))