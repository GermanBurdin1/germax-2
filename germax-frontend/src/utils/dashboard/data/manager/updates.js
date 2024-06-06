export function returnNotificationsModal() {
  return `
    <div class="modal fade" id="notificationsModal" tabindex="-1" role="dialog" aria-labelledby="notificationsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notificationsModalLabel">Notifications</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Содержимое уведомлений -->
            <div class="list-group" id="notificationsList">
              <!-- Уведомление о запросе на аренду оборудования -->
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">Demandes de location d'équipement</h5>
                  <small>À expirer</small>
                </div>
                <p class="mb-1">L'équipement XYZ doit être confirmé avant 18h00 aujourd'hui.</p>
              </a>
              <!-- Уведомление о просроченном возврате оборудования -->
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">Retour d'équipement en retard</h5>
                  <small class="text-muted">Il y a 3 jours</small>
                </div>
                <p class="mb-1">L'équipement ABC n'a pas été retourné à temps.</p>
              </a>
              <!-- Дополнительные уведомления -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
