;; Define the map to store reputation scores
(define-map reputation-scores
  {user: principal}
  {score: int, last-updated: uint})

;; Define the constant for minimum reputation change
(define-constant MIN_REPUTATION_CHANGE int-1)

;; Define the constant for maximum reputation change
(define-constant MAX_REPUTATION_CHANGE int1)

;; Initialize or update a user's reputation
(define-public (initialize-reputation (user principal))
  (if (is-some (map-get? reputation-scores {user: user}))
    (err u100) ;; Error: Reputation already initialized
    (ok (map-set reputation-scores {user: user} {score: int0, last-updated: block-height}))))

;; Update a user's reputation
(define-public (update-reputation (target principal) (change int))
  (let ((current-data (unwrap-panic (map-get? reputation-scores {user: target}))))
    (if (and (>= change MIN_REPUTATION_CHANGE) (<= change MAX_REPUTATION_CHANGE))
      (ok (map-set reputation-scores
                   {user: target}
                   {score: (+ (get score current-data) change),
                    last-updated: block-height}))
      (err u101)))) ;; Error: Invalid reputation change

;; Get a user's reputation
(define-read-only (get-reputation (user principal))
  (map-get? reputation-scores {user: user}))

;; Check if a user has a reputation score
(define-read-only (has-reputation (user principal))
  (is-some (map-get? reputation-scores {user: user})))