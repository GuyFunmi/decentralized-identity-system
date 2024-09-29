(define-map identities 
  ((user principal)) 
  (tuple (id uint) (name (string-ascii 50)) (email (string-ascii 50))))

(define-data-var next-id uint 1)

;; Create an identity
(define-public (create-identity (name (string-ascii 50)) (email (string-ascii 50)))
  (begin
    (if (is-some (map-get? identities ((user tx-sender))))
      (err u100) ;; Error: User already has an identity
      (let ((id (var-get next-id)))
        (begin
          (map-set identities ((user tx-sender)) (tuple (id id) (name name) (email email)))
          (var-set next-id (+ id u1))
          (ok id))))))

;; Get identity by user
(define-read-only (get-identity (user principal))
  (default-to none (map-get? identities ((user user)))))

;; Update identity
(define-public (update-identity (name (string-ascii 50)) (email (string-ascii 50)))
  (begin
    (if (is-none (map-get? identities ((user tx-sender))))
      (err u101) ;; Error: No identity found
      (map-set identities ((user tx-sender)) (tuple (id (unwrap-panic (get id (map-get identities ((user tx-sender)))))) (name name) (email email)))
      (ok true))))
