;; Define the map to store identities
(define-map identities 
  {user: principal}
  {id: uint, name: (string-ascii 50), email: (string-ascii 50)})
  

;; Define the variable to keep track of the next ID
(define-data-var next-id uint u1)

;; Create an identity
(define-public (create-identity (name (string-ascii 50)) (email (string-ascii 50)))
  (let ((id (var-get next-id)))
    (if (is-some (map-get? identities {user: tx-sender}))
      (err u100) ;; Error: User already has an identity
      (begin
        (map-set identities {user: tx-sender} {id: id, name: name, email: email})
        (var-set next-id (+ id u1))
        (ok id)))))

;; Get identity by user
(define-read-only (get-identity (user principal))
  (map-get? identities {user: user}))

;; Update identity
(define-public (update-identity (name (string-ascii 50)) (email (string-ascii 50)))
  (let ((existing-identity (map-get? identities {user: tx-sender})))
    (if (is-none existing-identity)
      (err u101) ;; Error: No identity found
      (begin
        (map-set identities 
          {user: tx-sender}
          (merge (unwrap-panic existing-identity) 
                 {name: name, email: email}))
        (ok true)))))