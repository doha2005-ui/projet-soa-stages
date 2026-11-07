package ma.inpt.soa.service5notificationsrest.rest;

import ma.inpt.soa.service5notificationsrest.model.Notification;
import javax.persistence.*;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotificationResource {

    private EntityManagerFactory getEntityManagerFactory() {
        return Persistence.createEntityManagerFactory("NotificationsPU");
    }

    @GET
    public Response getAllNotifications() {
        EntityManagerFactory emf = getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        try {
            List<Notification> notifications = em.createQuery("SELECT n FROM Notification n", Notification.class).getResultList();
            return Response.ok(notifications).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(createError(500, "Erreur lors de la récupération des notifications: " + e.getMessage()))
                    .build();
        } finally {
            em.close();
            emf.close();
        }
    }

    @GET
    @Path("/{id}")
    public Response getNotificationById(@PathParam("id") Long id) {
        EntityManagerFactory emf = getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        try {
            Notification notification = em.find(Notification.class, id);
            if (notification == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(createError(404, "Notification avec ID " + id + " introuvable"))
                        .build();
            }
            return Response.ok(notification).build();
        } finally {
            em.close();
            emf.close();
        }
    }

    @GET
    @Path("/destinataire/{destinataireId}")
    public Response getNotificationsByDestinataire(@PathParam("destinataireId") Long destinataireId) {
        EntityManagerFactory emf = getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        try {
            List<Notification> notifications = em.createQuery(
                "SELECT n FROM Notification n WHERE n.destinataireId = :destinataireId ORDER BY n.dateEnvoi DESC", 
                Notification.class)
                .setParameter("destinataireId", destinataireId)
                .getResultList();
            return Response.ok(notifications).build();
        } finally {
            em.close();
            emf.close();
        }
    }

    @POST
    public Response createNotification(Notification notification) {
        EntityManagerFactory emf = getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(notification);
            tx.commit();
            return Response.status(Response.Status.CREATED).entity(notification).build();
        } catch (Exception e) {
            tx.rollback();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(createError(400, "Erreur lors de la création de la notification: " + e.getMessage()))
                    .build();
        } finally {
            em.close();
            emf.close();
        }
    }

    @PUT
    @Path("/{id}/statut")
    public Response updateNotificationStatut(@PathParam("id") Long id, @QueryParam("statut") String statut) {
        EntityManagerFactory emf = getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Notification notification = em.find(Notification.class, id);
            if (notification == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(createError(404, "Notification avec ID " + id + " introuvable"))
                        .build();
            }
            notification.setStatut(Notification.StatutNotification.valueOf(statut));
            tx.commit();
            return Response.ok(notification).build();
        } catch (Exception e) {
            tx.rollback();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(createError(400, "Erreur lors de la mise à jour: " + e.getMessage()))
                    .build();
        } finally {
            em.close();
            emf.close();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteNotification(@PathParam("id") Long id) {
        EntityManagerFactory emf = getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Notification notification = em.find(Notification.class, id);
            if (notification == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(createError(404, "Notification avec ID " + id + " introuvable"))
                        .build();
            }
            em.remove(notification);
            tx.commit();
            return Response.noContent().build();
        } catch (Exception e) {
            tx.rollback();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(createError(500, "Erreur lors de la suppression: " + e.getMessage()))
                    .build();
        } finally {
            em.close();
            emf.close();
        }
    }

    private Map<String, Object> createError(int code, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("code", code);
        error.put("message", message);
        return error;
    }
}